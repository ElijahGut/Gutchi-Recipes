import React from 'react'
import FadeIn from 'react-fade-in'
import { IRecipe } from './App'
import Home from './Home'
import RecipePage from './RecipePage'

interface Props {
    logOut?: any,
    handleSetRecipeToShow: any,
    handleSetShowRecipePage: any,
    setAuthenticate?: any,
    showRecipePage: boolean,
    recipeToShow: IRecipe,
    isLoggedIn: boolean,
    recipes: Array<IRecipe>
}

const Main:React.FC<Props> = ({logOut, showRecipePage, recipeToShow, handleSetRecipeToShow, 
    handleSetShowRecipePage, isLoggedIn, recipes, setAuthenticate}) => {
    return (
        <div className="App">
        <FadeIn><div> 
        {isLoggedIn ? <button className='coolButton' style={{float: 'right', marginTop: '55px', marginRight: '10%'}} onClick={logOut}>Log out</button>
        : <button className='coolButton' style={{float: 'right', marginTop: '55px', marginRight: '10%'}} onClick={() => setAuthenticate(true)}>Log in</button>}
          
          <h1 style={{marginLeft: '17%', paddingTop: 50, paddingBottom: '30px', fontWeight: 300}}>Gutchi Recipes</h1>
          </div></FadeIn>
        {showRecipePage ? <RecipePage recipe={recipeToShow} handleSetRecipeToShow={handleSetRecipeToShow} 
        handleSetShowRecipePage={handleSetShowRecipePage}/> : <FadeIn><Home isLoggedIn={isLoggedIn} 
        recipeToShow={recipeToShow} handleSetRecipeToShow={handleSetRecipeToShow} 
        showRecipePage={showRecipePage} handleSetShowRecipePage={handleSetShowRecipePage} recipes={recipes}/></FadeIn>}
      </div>
    )
}

export default Main; 
