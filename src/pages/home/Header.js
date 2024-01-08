import homeIcon from '../../assets/images/logo.svg'
import styled from 'styled-components'
import ConnectButton from '../layout/ConnectButton'
import ErrorNetwork from '../layout/ErrorNetwork'
import useGlobal from "../../hooks/useGlobal";
import useWallet from "../../hooks/useWallet";
import { getLocal } from "../../utils"
import { useEffect, useState } from "react";
import { Link } from 'react-router-dom'
import Button from '../../component/Button';

export default function Header(props) {
  const { accounts, currentTokenBalance } = useGlobal()
  const { chainId, network } = useWallet()
  const { handleChangeNetwork } = props
  const [currentBalance, setCurrentBalance] = useState()
  const [showWallet, setShowWallet] = useState('')
  useEffect(() => {
    if (currentTokenBalance) {
      setCurrentBalance(currentTokenBalance)
    }
    if (accounts && accounts.length > 0) {
      setShowWallet(accounts[0].substring(0, 4) + '***' + accounts[0].substring(accounts[0].length - 4))
    }
  }, [currentTokenBalance, accounts])
  return (
    <HeaderContanier>
      <div className="header-content">
        <div className="header-left font-cs">
          <a href='/'>
            <img className='logo' src={homeIcon} alt="" />
          </a>
          <Link to="/migration/start">
            <p className='shake font-cm'>
              <span className="n">st</span>
              <span className="e">a</span>
              <span className="o">k</span>
              <span className="n2">e</span>
            </p> 
          </Link>

        </div>
        {
          (!accounts && !getLocal('account')) && <ConnectButton />
        }

        {
          (accounts || getLocal('account')) &&
          <div className='header-top-info'>
            {
              chainId !== 513100 || (!accounts || !getLocal('account')) &&
              <ErrorNetwork handleChangeNetwork={handleChangeNetwork} />
            }
            <div>
              <Button label={showWallet}></Button>
            </div>
          </div>
        }
      </div>
    </HeaderContanier>
  )
}
const HeaderContanier = styled.div`
  background-color: #f2f5f7;
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  z-index: 99;
  border-bottom: 1px solid #F2F2F2;
  .header-content{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    height: 62px;
    margin: 0 auto;
    max-width: 1400px;
  }
  .right-contanier {
    display: none
  }
  .header-left{
    margin-left: 20px;
    display: flex;
    align-items: center;
    .logo {
      width: 130px;
    }

    .shake {
      font-size: 22px;
      cursor: pointer;
      text-decoration: underline;
      color: #999;
      margin-left: 30px;
      span {
        animation: flicker 5s linear infinite;
        animation-delay: .2s;
        &.e {
          animation-delay: .7s;
        }
        &.o {
          animation-delay: 1s;
        }
        &.n2 {
          animation-delay: 1.5s;
        }
      }

      @keyframes flicker {
        0% {
          color: #333;
        }
        5%,
        15%,
        25%,
        30%,
        100% {
          color: #fff;
          text-shadow: 0px 0px 5px #42fff6, 0px 0px 10px #42fff6, 0px 0px 20px #42fff6,
            0px 0px 50px #42fff6;
        }
        10%,
        20% {
          color: #333;
          text-shadow: none;
        }
      }
    }

  }
  .header-right {
    flex: 1;
    margin-left: 20px;
    li {
      cursor: pointer;
    }
  }
  .header-content {
    .icon-client {
      width: 137px;
      height: 30px;
    }
  }

`
