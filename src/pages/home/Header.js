import homeIcon from '../../assets/images/logo.svg'
import styled from 'styled-components'
import ConnectButton from '../layout/ConnectButton'
import ErrorNetwork from '../layout/ErrorNetwork'
import useGlobal from "../../hooks/useGlobal";
import useWallet from "../../hooks/useWallet";
import { getLocal } from "../../utils"
import { useEffect, useState } from "react";
import Button from '../../component/Button';


export default function Header(props) {
  const { accounts, currentTokenBalance } = useGlobal()
  const { chainId, network } = useWallet()
  const { handleChangeNetwork } = props
  const [currentBalance, setCurrentBalance] = useState()
  const [showWallet, setShowWallet] = useState('')
  useEffect(() => {
    if(currentTokenBalance) {
      setCurrentBalance(currentTokenBalance)
    }
    if(accounts && accounts.length > 0) {
      setShowWallet(accounts[0].substring(0, 4) + '***' + accounts[0].substring(accounts[0].length - 4))
    }
  }, [currentTokenBalance, accounts])
  return (
    <HeaderContanier>
      <div className="header-content">
        <div className="header-left">
          <a href='/'>
            <img src={homeIcon} alt="" />
          </a>
        </div>
        {
          (!accounts && !getLocal('account')) && <ConnectButton />
        }
        
        {
          (accounts || getLocal('account')) &&
          <div className='header-top-info'>
            {
              chainId !== 513100 || (!accounts || !getLocal('account')) &&
              <ErrorNetwork handleChangeNetwork={handleChangeNetwork}/>
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
  z-index: 2;
  border-bottom: 1px solid #F2F2F2;
  .header-content{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0 auto;
    height: 72px;
    margin: 0 auto;
    max-width: 1400px;
  }
  .right-contanier {
    display: none
  }
 .header-left{
  margin-left: 20px;
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
