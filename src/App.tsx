import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import FadeIn from 'react-fade-in';
import Home from './Home';
import RecipePage from './RecipePage';
import Authenticate from './Authenticate';

const firebaseConfig = {
  apiKey: "AIzaSyA-Qk19i2we8JV6KGpT-oA0swkeJnLa8-4",
  authDomain: "gut-recipes.firebaseapp.com",
  databaseURL: "https://gut-recipes.firebaseio.com",
  projectId: "gut-recipes",
  storageBucket: "gut-recipes.appspot.com",
  messagingSenderId: "121353411653",
  appId: "1:121353411653:web:f08a473cb6dcd8fe01572c"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

export interface IRecipe {
  name: string,
  description: string,
  method: Array<string>,
  ingredients: Array<string>,
  meal_type: string,
  image: string,
  cooking_time: number
}

const App: React.FC = () => {

  const initialRecipe: IRecipe = {
    name: '',
    description: '',
    method: [],
    ingredients: [],
    meal_type: '',
    image: '',
    cooking_time: 0
  }

  const [recipes, setRecipes] = useState<Array<IRecipe>>([])
  const [recipeToShow, setRecipeToShow] = useState<IRecipe>(initialRecipe)
  const [showRecipePage, setShowRecipePage] = useState(false)
  const [authenticate, setAuthenticate] = useState(false)

  const [isLoggedIn, setLog] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPass] = useState('')
  const [showError, setShowError] = useState(false)

  const shuffle = (recipes: Array<IRecipe>) => {
    for (let i=recipes.length-1;i>0;i--) {
      const j = Math.floor(Math.random() * i)
      const temp = recipes[i]
      recipes[i] = recipes[j]
      recipes[j] = temp
    }
    return recipes
  }

  const handleSetRecipeToShow = (val: IRecipe) => {
    setRecipeToShow(val)
  }

  const handleSetShowRecipePage = (val: boolean) => {
    setShowRecipePage(val)
  }

  useEffect(() => {
    auth.onAuthStateChanged(user => {
      if (user) {
        setLog(true)
        setAuthenticate(false)
      } else {
        setLog(false)
      }
    })
    const db = firebase.firestore()
    db.collection('recipes').get().then(querySnapshot => {
      querySnapshot.forEach(doc => {
        setRecipes(prevState => shuffle([...prevState, doc.data() as IRecipe]))
      })
    })
  }, [])

  const authUser = (email:string, password:string) => {
    auth.signInWithEmailAndPassword(email, password).catch(error => {
      setShowError(true)
    })
  }

  const emailHandler = (email:string) => {
    setEmail(email)
  }

  const passHandler = (pass:string) => {
    setPass(pass)
  }

  const logOut = () => {
    auth.signOut().catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode);
      console.log(errorMessage);
    })
    setEmail('')
    setPass('')
    setShowError(false)
  }

  const authenticateHandler = () => {
    setAuthenticate(false)
  }

  if (isLoggedIn) {
    return (
      <div className="App">
        <FadeIn><div>
          <button className='coolButton' style={{float: 'right', marginTop: '55px', marginRight: '10%'}} onClick={logOut}>Log out</button>
          <h1 style={{marginLeft: '17%', paddingTop: 50, paddingBottom: '30px', fontWeight: 300}}>Gutchi Recipes</h1>
          </div></FadeIn>
        {showRecipePage ? <RecipePage recipe={recipeToShow} handleSetRecipeToShow={handleSetRecipeToShow} 
        handleSetShowRecipePage={handleSetShowRecipePage}/> : <FadeIn><Home isLoggedIn={isLoggedIn} 
        recipeToShow={recipeToShow} handleSetRecipeToShow={handleSetRecipeToShow} 
        showRecipePage={showRecipePage} handleSetShowRecipePage={handleSetShowRecipePage} recipes={recipes}/></FadeIn>}
      </div>
    );
  } else {
    return (
      <div>
        {authenticate ? <div>
        <Authenticate authUser={authUser} emailHandler={emailHandler} authenticateHandler={authenticateHandler}
        passHandler={passHandler} email={email} password={password} showError={showError}/>
      </div> : 
      <div className="App">
      <FadeIn><div>
        <button className='coolButton' style={{float: 'right', marginTop: '55px', marginRight: '10%'}} onClick={() => setAuthenticate(true)}>Log in</button>
        <h1 style={{marginLeft: '17%', paddingTop: 50, paddingBottom: '30px', fontWeight: 300}}>Gutchi Recipes</h1>
        </div></FadeIn>
      {showRecipePage ? <RecipePage recipe={recipeToShow} handleSetRecipeToShow={handleSetRecipeToShow} 
      handleSetShowRecipePage={handleSetShowRecipePage}/> : <FadeIn><Home isLoggedIn={isLoggedIn}
      recipeToShow={recipeToShow} handleSetRecipeToShow={handleSetRecipeToShow} 
      showRecipePage={showRecipePage} handleSetShowRecipePage={handleSetShowRecipePage} recipes={recipes}/></FadeIn>}
    </div>
      }
      </div>
      
    )
  }
}

export default App;
