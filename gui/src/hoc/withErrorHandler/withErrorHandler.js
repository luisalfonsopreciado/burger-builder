import React from 'react'
import Modal from '../../components/UI/Modal/Modal'
import Aux from '../Aux'

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends React.Component {
        state = {
            error: null
        }
        
        componentDidMount(){
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({error: null})
                return req
            })
            this.resInterceptor = axios.interceptors.response.use(res=> res, error =>{
                this.setState({error: error})
            })
        }

        componentWillUnmount(){
            axios.interceptors.request.eject(this.resInterceptor);
            axios.interceptors.request.eject(this.reqInterceptor);
        }
        errorConfirmedHandler = () => {
            this.setState({error: null})
        }
        render(){
                return (
                    <Aux>
                        <Modal 
                            show={this.state.error} 
                            modalClosed={this.errorConfirmedHandler}>
                            {this.state.error ? this.state.error.message: null}
                        </Modal>
                        <WrappedComponent {...this.props}/>
                    </Aux>
                )
            
        }
    } 
}
export default withErrorHandler