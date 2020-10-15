import React from 'react'
import { useState } from 'react'
import { IRecipe } from './App'
import { Container } from 'reactstrap'
import FadeIn from 'react-fade-in';
import Step from './Step'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock, faUtensils } from '@fortawesome/free-solid-svg-icons'

interface Props {
    recipe: IRecipe,
    handleSetRecipeToShow: any,
    handleSetShowRecipePage: any
}

const RecipePage: React.FC<Props> = ({recipe, handleSetRecipeToShow, handleSetShowRecipePage}) => {

    const [ingredientCardHeight, setIngCardHeight] = useState<number>(0)

    const backToBrowse = () => {
        handleSetRecipeToShow(false)
        handleSetShowRecipePage(false)
        window.scrollTo(0,0)
    }

    // refactor

    const articleWords = ['the', 'of', 'and', 'a', 'with', 'on']

    const capitaliseName = (recipeName: string) => {
        let result = ''
        const recipeNameSplit = recipeName.split(' ')

        for (let i=0;i<recipeNameSplit.length;i++) {
            let word = recipeNameSplit[i];
            if (!articleWords.includes(word.toLowerCase())) {
                let capitalisedWord = word.charAt(0).toUpperCase()+word.slice(1)
                result += capitalisedWord += ' '  
            } else {
                result += word += ' '
            }
        }
        return result.trim();
    }

    const renderIngredients = () => {
        return recipe.ingredients.map((ing, i) => <li key={i} style={{textAlign: 'left'}}>{ing}</li>)
    }

    const renderMethod = () => {
        return recipe.method.map((step, i) => <Step step={step} stepNumber={i+1} key={i}/>)
    }

    return (
        <FadeIn>
            <div style={{paddingTop:'10px'}}>
                <Container>
                    <img alt='recipeImage' src={recipe.image} style={{objectFit: 'cover', borderRadius: '50%', 
                    border: '1px solid white', marginBottom: '10px', marginRight: '2%'}} width={'225px'} height={'225px'}/>
                    <h1 style={{textAlign: 'center'}}>{capitaliseName(recipe.name)}</h1>
                    <hr style={{borderTop: '0.5px solid white', width: '25%'}}/>
                    <div>
                        <FontAwesomeIcon style={{marginRight: 10}} 
                        icon={faClock}/>{recipe.cooking_time+'min'}
                        <FontAwesomeIcon style={{marginLeft: 15, marginRight: 10}} icon={faUtensils}/>{recipe.meal_type.charAt(0).toUpperCase()+recipe.meal_type.slice(1)}
                    </div>
                    <div style={{display: 'flex', justifyContent: 'center'}}>
                        <div style={{position: 'sticky', top: 20, float: 'left', height: ingredientCardHeight, width: '80%', border: '1px solid white', 
                        borderRadius: '0.6em', padding: 15, paddingLeft: 20, paddingRight: 20, marginTop: 70, marginRight: 60}}>
                            <h2 style={{textAlign: 'left'}}>Ingredients</h2>
                            <ul ref={el=> {
                                if (!el) return;
                                setIngCardHeight(el.getBoundingClientRect().height+80)
                            }}>
                                {renderIngredients()}
                            </ul>
                        </div>
                        <div style={{marginTop: 60}}>
                            <h2 style={{textAlign: 'left', paddingBottom: 30}}>Method</h2>
                            {renderMethod()}
                        </div>
                    </div>
                </Container>
                <button className='styledButton' style={{marginTop: 10}} type='button' onClick={backToBrowse}>Back to browse</button>
            </div>
        </FadeIn>
    )
}

export default RecipePage
