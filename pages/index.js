import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import CoinGecko from 'coingecko-api';
const coinGeckoClient = new CoinGecko();

export default function Home(props) {
  const {data} = props.result;
  //console.log(data)

  const formatPercent = number => {
    if (Math.sign(number) > 0) {
      return '▲ ' + `${new Number(Math.abs(number)).toFixed(2)}%`
    }
    else {
      return '▼ ' + `${new Number(Math.abs(number)).toFixed(2)}%`
    }
  }

  const formatDollar = (number, maximumSignificantDigits) =>
    new Intl.NumberFormat(
      'en-US',
      {
        style: 'currency',
        currency: 'usd',
        maximumSignificantDigits
      })
      .format(number);

  return (
    <div className={styles.container}>
      <Head>
        <title>Simple Crypto Tracker</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <h1>Simple Crypto Tracker</h1>

      <table className='content-table'>
        {/* first table row (header) */}
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Ticker</th>
            <th>Price</th>
            <th>24hr</th>
            <th>Market Cap</th>
          </tr>
        </thead>
       {/* all other table rows (data) */}
        <tbody>
          {data.map(coin => (
            <tr key = {coin.id}>
              <td>{coin.market_cap_rank}</td>
              <td>
                <img src = {coin.image} style = {{width: 25, height: 25, marginRight: 10}}></img>
                {coin.name}
              </td>
              <td>
                {coin.symbol.toUpperCase()}
              </td>
              <td>{formatDollar(coin.current_price, 20)}</td>
              <td>
                <span 
                  className={coin.price_change_percentage_24h > 0 ? ('text-success') : ('text-danger')}>
                  {formatPercent(coin.price_change_percentage_24h)}
                </span>
              </td>
              <td>{formatDollar(coin.market_cap, 20)}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  )
}



export async function getServerSideProps(context) {
  const params = {
    order: CoinGecko.ORDER.MARKET_CAP_DESC
  }

  const result = await coinGeckoClient.coins.markets({params});

  return {
    props: {
      result
    }
  }
}
