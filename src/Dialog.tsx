import React, { useState } from 'react'
import { Modal, ModalHeader, ModalFooter } from 'reactstrap'
import './App.css'

interface Props {

}

const Dialog:React.FC<Props> = () => {

    const [modal, setModal] = useState(true)
    const toggle = () => setModal(!modal)

    return (
        <div>
            <Modal style={{paddingTop: '20%', width: '400px', height: '150px'}} isOpen={modal}>
                <ModalHeader style={{backgroundColor: '#f9844a', border: '0.5px solid white', borderBottom: 'none', paddingLeft: '20%', paddingTop: '10%', color: 'white'}}>
                    Recipe successfully added!
                </ModalHeader>
                <ModalFooter style={{justifyContent: 'center', backgroundColor: '#f9844a', border: '0.5px solid white', borderTop: 'none'}}>
                    <button className='coolButton' style={{marginTop: 10}} onClick={toggle}>Ok</button> 
                </ModalFooter>
            </Modal>
        </div>
    )
}

export default Dialog;