import styled from "styled-components"
import Modal from '../../component/Modal'
import { getLocal } from '../../utils'
import { useEffect, useState } from "react";
import useGlobal from "../../hooks/useGlobal";
import ChangeNetwork from '../home/ChangeNetwork'
import useWallet from '../../hooks/useWallet'
import Header from "../home/Header";
export default function HeaderInfo() {
  const { showConnectNetwork } = useGlobal()
  const { setState } = useGlobal()

  const { changeNetwork } = useWallet()
  const [showConnectWallet, setShowConnectWallet] = useState(false)
  const isConnect = (+getLocal('isConnect'))
  const selectNetwrok = (item) => {
    switch(item.name) {
      case 'MetaMask':
        changeNetwork(item.network)
        break;
      default:
        console.log('Unknown')
    }
    setShowConnectWallet(false)
  }
  useEffect(() => {
    if(showConnectNetwork) {
      setShowConnectWallet(true)
    } else {
      setShowConnectWallet(false)
    }
  }, [showConnectNetwork, isConnect])
  return (
    <HeaderInfoContanier>
      <Header handleChangeNetwork={() => setShowConnectWallet(true)}/>
      <Modal title="Connect Wallet" visible={showConnectWallet} onClose={() => setState({ showConnectNetwork: false })}>
        <ChangeNetwork handleChangeNetWork={(item) => selectNetwrok(item)} closeNetworkContainer={() => setShowConnectWallet(false)} />
      </Modal>
    </HeaderInfoContanier>
  )
}
const HeaderInfoContanier = styled.div`
  background: #fff;
  width: 100%;
`
