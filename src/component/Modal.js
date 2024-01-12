import React, { Fragment, useRef } from 'react'
import ReactDOM from 'react-dom'
import './style.scss'
import styled from 'styled-components'
import Close from '../assets/icon/Close.svg'
const Titles = styled.div`
  flex:1;
`
const ModalHead = styled.div`
  padding:10px 0 20px;
  display:flex;
  align-items:center;
`

export default function ModalContainer(props) {
  // const {slider} = props
  const { visible = false,slider = false, title = null, maskClose = true, excat, ...rest } = props
  const maskRef = useRef()
  const close = (e) => {
    if (e.target === maskRef.current)  maskClose && props.onClose(false)
    e.stopPropagation();
  }
  return (
    <Fragment>
      {
        visible &&
        ReactDOM.createPortal(
          <div className="mask f-c-c">
          <div className={slider ? `modal-wrap fixed` : `modal-wrap`} onClick={close} ref={ maskRef } >
            <div className="modal" {...rest}>
              <img className='icon-close w-4' src={Close} />
              <div className="iconfont icon-close" onClick={()=> props.onClose(false)}/>
                {
                  title &&
                <ModalHead className="f-c-sb">
                  { excat }
                  <Titles style={{fontSize: '18px'}}>{title}</Titles>
                </ModalHead>
                }
                <div className="modal-container">
                  { props.children }
                </div>
            </div>
          </div>
        </div>, document.querySelector('body'))
      }
    </Fragment>
  )
}