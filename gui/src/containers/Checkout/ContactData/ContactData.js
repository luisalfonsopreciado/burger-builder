import React from 'react'
import Button from '../../../components/UI/Button/Button'
import Spinner from '../../../components/UI/Spinner/Spinner'
import classes from './ContactData.module.css'
import {withRouter} from 'react-router-dom'
import Input from '../../../components/UI/Input/Input'
import {connect} from 'react-redux'
import * as actions from "../../../store/actions/index"
import axios from '../../../axios-orders'
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'

class ContactData extends React.Component{
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                },
                value: '',
                validation: {
                    required: true,
                    minLength: 5,
                    maxLength: 5
                },
                valid: false,
                touched: false
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your E-Mail'
                },
                value: '',
                validation: {
                    required: true
                },
                valid: false,
                touched: false
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        {value: 'fastest', displayValue: 'Fastest'},
                        {value: 'cheapest', displayValue: 'Cheapest'}
                    ]
                },
                value: 'fastest',
                validation: {
                    required: true
                },

               
            },
        },
        formIsValid: false,
    }

    checkValidity = (value, rules) =>{
        let isValid = true
        if(!rules){
            return true
        }
        if(rules.required){
            isValid = (value.trim() !== '' && isValid)
        }
        if(rules.minLength){
            isValid = (value.length >= rules.minLength && isValid)
        }
        if(rules.maxLength){
            isValid = (value.length <= rules.maxLength && isValid)
        }
        return isValid
    }
    orderHandler = (event) => {
        event.preventDefault()
        const order = {
            ...this.props.ings
        }
        for(let formElementIdentifier in this.state.orderForm){
            order[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value
        }
        
        this.props.onOrderBurger(order, this.props.token, this.props.userId)
    }

    inputChangedHandler= (event, inputIdentifier) => {
        const updatedOrderForm = {
            ...this.state.orderForm
        }
        const updatedFormElement = {
            ...updatedOrderForm[inputIdentifier]
        }
        updatedFormElement.value = event.target.value
        updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation)
        updatedFormElement.touched = true;
        updatedOrderForm[inputIdentifier] = updatedFormElement
        let formIsValid = true
        for(let inputIdentifier in updatedOrderForm){
            if(updatedOrderForm[inputIdentifier].valid === false){
                formIsValid = false;
            }
        }

        this.setState({orderForm: updatedOrderForm, formIsValid: formIsValid})

    }
    cancelHandler = () => {
        this.props.history.push('/')
    }

    render(){
        const formElementsArray= []
        for(let key in this.state.orderForm){
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            })
        }

        let form = (
                <form onSubmit={this.orderHandler}>
                    {formElementsArray.map((formElement, key) =>{
                        return <Input 
                            key={formElement.id}
                            elementType={formElement.config.elementType}
                            elementConfig={formElement.config.elementConfig}
                            invalid={!formElement.config.valid}
                            shouldValidate={formElement.config.validation}
                            value={formElement.config.value} 
                            touched={formElement.config.touched}
                            changed={(event) => this.inputChangedHandler(event, formElement.id)}/>
                    })}
                    <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
                    <Button btnType="Danger" clicked={this.cancelHandler}>CANCEL</Button>
                </form>
        )
        if(this.props.loading){
            form = <Spinner/>
        }
        return(
            <div className={classes.ContactData}>
                <h4>Enter your contact data</h4>
                {form}   
            </div>
        )
    }
}

const mapStateToProp = state =>{
    return{
        ings : state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token, userId) =>  dispatch(actions.purchaseBurger(orderData, token, userId)),
    }
}

export default connect(mapStateToProp, mapDispatchToProps)(withRouter(withErrorHandler(ContactData, axios)))