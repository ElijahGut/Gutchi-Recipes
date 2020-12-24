import React from 'react'
import firebase from 'firebase/app'
import 'firebase/firestore'
import { Container } from 'reactstrap'
import './App.css'
import Step from './Step'
import Ingredient from './Ingredient'

interface Props {
    name?: string,
    description?: string,
    image?: string,
    meal_type?: string,
    ingredients?: Array<string>,
    method?: Array<string>,
    cooking_time?: string,
    clearAutomatic?: any,
    yield?: string
}

export interface State {
    name: string,
    short_name: string,
    description: string,
    meal_type: string,
    ingredients_input: string,
    ingredients: Array<string>,
    method_input: string,
    method: Array<string>,
    image: string,
    cooking_time: string,
    preview_ingredients: boolean,
    preview_method: boolean,
    show_length_error: boolean,
    yield: string
}

class ManualRecipe extends React.Component<Props, State> {
    // eslint-disable-next-line
    constructor(props: Props) {
        super(props)
        this.state = {
            name:  this.props.name ? this.props.name : '',
            short_name: '',
            description: this.props.description ? this.props.description : '',
            meal_type: this.props.meal_type ? this.props.meal_type : '',
            ingredients_input: this.props.ingredients ? this.props.ingredients.join('\n\n') : '',
            ingredients: [],
            method_input: this.props.method ? this.props.method.join('\n\n') : '',
            method: [],
            image: this.props.image ? this.props.image : '',
            cooking_time: this.props.cooking_time ? this.props.cooking_time : '',
            preview_ingredients: false,
            preview_method: false,
            show_length_error: false,
            yield: this.props.yield ? this.props.yield : ''
        }
    }

    componentDidMount() {
        window.scrollTo(0,0);
    }

    resetState = () => {
        this.setState({
            name: '',
            short_name: '',
            description: '',
            meal_type: '',
            ingredients_input: '',
            ingredients: [],
            method_input: '',
            method: [],
            image: '',
            cooking_time: '',
            preview_ingredients: false,
            preview_method: false,
            show_length_error: false
        })
        if (this.props.clearAutomatic) {
            this.props.clearAutomatic()
        }
    }

    addRecipe = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        window.scrollTo(0,0)
        const db = firebase.firestore()

        const finalMethod = this.getMethod()
        const finalIngredients = this.getIngredients()

        if (this.state.short_name.length <= 15) {
            if (this.state.image.length === 0) {
                db.collection('recipes').doc(this.state.name.toLowerCase()).set({
                    name: this.state.name.trim().toLowerCase(),
                    short_name: this.state.short_name.trim().toLowerCase(),
                    description: this.state.description.trim(),
                    meal_type: this.state.meal_type,
                    ingredients: finalIngredients?.filter(ing => ing !== ''),
                    method: finalMethod?.filter(step => step !== ''),
                    image: 'https://images.squarespace-cdn.com/content/v1/57879a6cbebafb879f256735/1579721909133-R2KSZ8VGDGBI90DYATBK/ke17ZwdGBToddI8pDm48kLkXF2pIyv_F2eUT9F60jBl7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0iyqMbMesKd95J-X4EagrgU9L3Sa3U8cogeb0tjXbfawd0urKshkc5MgdBeJmALQKw/header4.jpg?format=2500w',
                    cooking_time: parseInt(this.state.cooking_time.trim()),
                    yield: parseInt(this.state.yield.trim())
                })   
            } else {
                db.collection('recipes').doc(this.state.name.toLowerCase()).set({
                    name: this.state.name.trim().toLowerCase(),
                    short_name: this.state.short_name.trim().toLowerCase(),
                    description: this.state.description.trim(),
                    meal_type: this.state.meal_type,
                    ingredients: finalIngredients?.filter(ing => ing !== ''),
                    method: finalMethod?.filter(step => step !== ''),
                    image: this.state.image.trim(),
                    cooking_time: parseInt(this.state.cooking_time.trim()),
                    yield: parseInt(this.state.yield.trim())
                })
            }
            alert('Recipe added successfully!')
            this.resetState()
        } else {
            document.getElementById('shortNameInput')?.scrollIntoView(true)
        }
        
    }

    checkShortNameError = (n:number) => {
        if (n <= 15) {
            this.setState({show_length_error: false})
        } else {
            this.setState({show_length_error: true})
        }
    }

    handleNameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        this.setState({name: e.currentTarget.value})
    }

    handleShortNameChange = (e:React.ChangeEvent<HTMLInputElement>) => {
       
        this.setState({short_name: e.currentTarget.value}, () => 
        this.checkShortNameError(this.state.short_name.length))
       
    }

    handleDescriptionChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({description: e.currentTarget.value})
    }

    handleMealTypeChange = (e:React.ChangeEvent<HTMLSelectElement>) => {
        this.setState({meal_type: e.currentTarget.value})
    }

    handleIngredientsChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ingredients_input: e.currentTarget.value})
    }

    handleMethodChange = (e:React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({method_input: e.currentTarget.value})
    }

    handleImageChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        this.setState({image: e.currentTarget.value})
    }

    handleCookingTimeChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        this.setState({cooking_time: e.currentTarget.value})
    }

    handleServingsChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        this.setState({yield: e.currentTarget.value})
    }

    getMethod = () => {
        const splitRegex = /\n+/g
        if (this.state.method_input.length !== 0) {
            let methodInputCopy = this.state.method_input
            let finalMethod = methodInputCopy.split(splitRegex)
            return finalMethod
        } 
    }

    previewMethod = () => {
        this.setState(prevState => 
            ({preview_method: !prevState.preview_method }))
        const splitRegex = /\n+/g
        if (this.state.method_input.length !== 0) {
            let methodInputCopy = this.state.method_input.trim()
            this.setState({method: methodInputCopy.split(splitRegex)})
        } 
    }

    clearMethod = () => {
        this.setState({method: [], method_input: ''})
    }

    renderSteps = () => {
        let methodCopy = [...this.state.method]
        if (methodCopy.length !== 0) {
            return methodCopy.map((step, i) => <Step key={i} stepNumber={i+1} step={step.charAt(0).toUpperCase()+step.slice(1)}/>) 
        }
    }

    getIngredients = () => {
        const splitRegex = /\n+/g
        if (this.state.ingredients_input.length !== 0) {
            let ingredientsInputCopy = this.state.ingredients_input.trim()
            let finalIngredients = ingredientsInputCopy.split(splitRegex)
            return finalIngredients
        } 
    }

    previewIngredients = () => {
        this.setState(prevState => 
            ({preview_ingredients: !prevState.preview_ingredients }))
        const splitRegex = /\n+/g
        if (this.state.ingredients_input.length !== 0) {
            let ingredientsInputCopy = this.state.ingredients_input
            this.setState({ingredients: ingredientsInputCopy.split(splitRegex) }) 
        }    
    }

    clearIngredients = () => {
        this.setState({ingredients: [], ingredients_input: ''})
    }

    renderIngredients = () => {
        let ingCopy = [...this.state.ingredients]
        if (this.state.ingredients.length !== 0) {
            return ingCopy.map((ing, i) => <Ingredient key={i} ingredient={ing.charAt(0).toUpperCase()+ing.slice(1)}/>) 
        }
    }

    render() {
        return (
            <Container>
                <div>
                    <div>
                        <form onSubmit={this.addRecipe}>
                            <div className='inputDiv'>
                                <label htmlFor='name'>Name</label><br/>
                                <input className='formInput' required name='name' type='text' 
                                onChange={this.handleNameChange} value={this.state.name}></input>
                            </div>
                            <div className='inputDiv' id='shortNameInput'>
                                {this.state.show_length_error ? <h6 style={{fontWeight: 600, textAlign: 'left', color: 'red'}}>Short name must be at most 15 characters long</h6> : null}
                                <label htmlFor='shortName'>Short Name (this name will appear on the recipe card)</label><br/>
                                <input className='formInput' required name='shortName' type='text' 
                                onChange={this.handleShortNameChange} value={this.state.short_name}></input>
                            </div>
                            <div className='inputDiv'>
                                <label htmlFor='description'>Description</label><br/>
                                <textarea className='formInput' style={{resize: 'none'}} required name='description' 
                                onChange={this.handleDescriptionChange} value={this.state.description}></textarea>
                            </div>
                            <div className='inputDiv'>
                            <label htmlFor='mealType'>Meal Type</label><br/>
                            <select className='formInput' style={{padding: '3px'}} required name='mealType' onChange={this.handleMealTypeChange} value={this.state.meal_type}>
                                <option value=''>None</option>
                                <option value='appetiser'>Appetiser</option>
                                <option value='main course'>Main course</option>
                                <option value='dessert'>Dessert</option>
                            </select>
                        </div>
                            <div className='inputDiv'>
                                <label htmlFor='ingredients'>Ingredients (start a new line between ingredients)</label><br/>
                                <textarea className='formInput' style={{resize: 'none'}} required name='ingredients' rows={5}
                                onChange={this.handleIngredientsChange} value={this.state.ingredients_input}></textarea>
                                <button className='styledButton' style={{marginTop: 20, marginBottom: 10, marginRight: 5}} type='button' onClick={this.previewIngredients}>{this.state.preview_ingredients 
                                && this.state.ingredients.length > 0 ? 'Hide preview' : 'Preview ingredients'}</button>
                                <button className='styledButton' style={{marginTop: 20, marginBottom: 10}} type='button' onClick={this.clearIngredients}>Clear</button>
                                {this.state.preview_ingredients && this.state.ingredients.length > 0 ? 
                                <div style={{marginTop: 10, marginBottom: 30}}><h3 style={{textAlign: 'left', paddingBottom: 10}}>Ingredients</h3>{this.renderIngredients()}</div> : null}
                            </div>
                            <div className='inputDiv'>
                                <label htmlFor='method'>Method (start a new line between steps)</label><br/>
                                <textarea className='formInput' style={{resize: 'none'}} required name='method' rows={5}
                                onChange={this.handleMethodChange} value={this.state.method_input}></textarea>
                                <button className='styledButton' style={{marginTop: 20, marginBottom: 10, marginRight: 10}} type='button' onClick={this.previewMethod}>{this.state.preview_method 
                                && this.state.method.length > 0 ? 
                                'Hide preview' : 'Preview method'}</button>
                                <button className='styledButton' style={{marginTop: 20, marginBottom: 10}} type='button' onClick={this.clearMethod}>Clear</button>
                                {this.state.preview_method && this.state.method.length > 0 ? this.renderSteps() : null}
                            </div>
                            <div className='inputDiv'>
                                <label htmlFor='cooking_time'>Cooking Time (in minutes)</label><br/>
                                <input className='formInput' required name='cooking_time' type='number' step={5} 
                                onChange={this.handleCookingTimeChange} value={this.state.cooking_time}></input>
                            </div>
                            <div className='inputDiv'>
                                <label htmlFor='servings'>Servings</label><br/>
                                <input className='formInput' required name='servings' type='number'
                                onChange={this.handleServingsChange} value={this.state.yield}></input>
                            </div>
                            <div className='inputDiv'>
                                <label htmlFor='image'>Photo URL (use the preview to double-check your photo URL)</label><br/>
                                <input className='formInput' required name='image' type='text' 
                                onChange={this.handleImageChange} value={this.state.image}></input>
                                {this.state.image.length !== 0 ? 
                                <div>
                                    <h3 style={{paddingTop: 20}}>Preview</h3>
                                    <img alt='imgPreview' src={this.state.image} style={{padding: 30, textAlign: 'center', objectFit: 'cover'}} width={400} height={400}/>
                                </div>
                                : null}
                            </div>    
                            <button className='styledButton' type='submit'>Add recipe</button>
                        </form>
                    </div>
                    <button className='styledButton' onClick={() => {
                        window.location.reload()
                    }}>Back to browse</button>
                </div>
            </Container> 
        )
    }
}

export default ManualRecipe;

