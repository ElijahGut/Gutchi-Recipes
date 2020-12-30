import React from 'react'
import { useState } from 'react'
import { IRecipe } from './App'
import Recipes from './Recipes'
import NewRecipe from './NewRecipe'
import FadeIn from 'react-fade-in'
import Search from './Search'

interface Props {
    recipes: Array<IRecipe>,
    recipeToShow: IRecipe,
    handleSetRecipeToShow: any,
    showRecipePage: boolean,
    handleSetShowRecipePage: any,
    isLoggedIn: boolean
}

const Home: React.FC<Props> = ({recipes, handleSetRecipeToShow, handleSetShowRecipePage, isLoggedIn}) => {
    const [inputVal, setInputVal] = useState('')
    const [searchVal, setSearchVal] = useState('')
    const [showSearch, setShowSearch] = useState(false)
    const [showNew, setShowNew] = useState(false)
    const [selectedMealType, setSelectedMealType] = useState('');

    const handleChange = (e:React.ChangeEvent<HTMLInputElement>) => {
        setInputVal(e.target.value)
    }

    const handlePress = (e:React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && inputVal.length !== 0) {
            setSelectedMealType('')
            setShowSearch(true)
            setSearchVal(inputVal)  
        } 
    }

    const handleClick = () => {
        if (inputVal.length !== 0) {
            setSelectedMealType('')
            setShowSearch(true)
            setSearchVal(inputVal)
        }
    }

    const handleShowNew = (val: boolean) => {
        setShowNew(val)
    }

    const searchByString = (searchVal: string, recipes: Array<IRecipe>) => {
        const searchResults: Array<IRecipe> = recipes.filter(recipe => {            
            return recipe.name.search(searchVal) !== -1
        })
        return searchResults;
    }

    const searchByMealType = (mealType: string, recipes: Array<IRecipe>) => {
        const searchResults: Array<IRecipe> = recipes.filter(recipe => {
            return recipe.meal_type === mealType
        })
        return searchResults;
    }

    if (selectedMealType !== '') {
        return (
            <div>
                <Search handlePress={handlePress} handleClick={handleClick} handleChange={handleChange} 
                selectedMealType={selectedMealType} setSelectedMealType={setSelectedMealType}/>
                <Recipes recipes={searchByMealType(selectedMealType, recipes)} handleSetRecipeToShow={handleSetRecipeToShow} 
                    handleSetShowRecipePage={handleSetShowRecipePage} 
                    headerString={selectedMealType.charAt(0).toUpperCase()+selectedMealType.slice(1)+'s'}/>
                    <button className='styledButton' type='button' onClick={() => {setSelectedMealType('')}}>Back to browse</button>
            </div>
        )
    } else if (showSearch) {
        return (
            <div>
                <Search handlePress={handlePress} handleClick={handleClick} handleChange={handleChange} 
                selectedMealType={selectedMealType} setSelectedMealType={setSelectedMealType}/>
                <div>
                    <Recipes recipes={searchByString(searchVal.toLowerCase(), recipes)} handleSetRecipeToShow={handleSetRecipeToShow} 
                    handleSetShowRecipePage={handleSetShowRecipePage} 
                    headerString={'Search Results'} searchVal={searchVal.toLowerCase()}/>
                    <button className='styledButton' type='button' onClick={() => {setShowSearch(false)}}>Back to browse</button>
                </div>
            </div>
        )
    } else {
        return (
            <div>
                {showNew ? <FadeIn><NewRecipe handleShowNew={handleShowNew}/></FadeIn>
                : <div>
               <Search handlePress={handlePress} handleClick={handleClick} handleChange={handleChange} 
                selectedMealType={selectedMealType} setSelectedMealType={setSelectedMealType}/>
                <Recipes recipes={recipes} handleSetRecipeToShow={handleSetRecipeToShow} 
                    handleSetShowRecipePage={handleSetShowRecipePage} headerString={'Browse'}/>
                {isLoggedIn ? <FadeIn delay={600}><button type='button' className='styledButton' 
                onClick={() => setShowNew(true)}>Add a new recipe</button></FadeIn> :  null}
            </div>}
            </div>
        )
    }
}

export default Home;