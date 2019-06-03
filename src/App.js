import React, {Component} from 'react';
// importing loader spinner as an image
import loader from './images/loader.svg';
import clearButton from './images/close-icon.svg';
import Gif from './Gif';

const randomChoice = arr => {
  const randIndex = Math.floor(Math.random() * arr.length);
  return arr[randIndex];
};

// we pick out our props inside the header component 
// we can pass down functions as props as well as things like numbers, strings, arrayss or objects
const Header = ({clearSearch, hasResults}) => (
  <div className="header grid">
    {/* if we have results, show the clear button, otherwise show the title */}
    {hasResults ? (
      <button onClick={clearSearch}>
        <img src={clearButton} />
      </button> ) : (<h1 className="title">Jiffy</h1>)}
  </div>
);

const UserHint = ({loading, hintText}) => (
  <div className='user-hint'>
    {/* checking whether we have a loading state and render out either spinner or hintText based on that using ternary operator (if/else) */}
    {loading ? <img className="block mx-auto" src={loader} /> : hintText}
  </div>
);

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      searchTerm: '',
      hintText: '',
      // we have an array of gifs
      gifs:[]
    };
  }

  // we want a function that searches the giphy api using fetch and puts the search term into the query URL,
  // and then we can do something with the results

  // we can also write async methods into our components that let us use the async/awair style of function
  searchGiphy = async searchTerm => {
    // first we try our fetch
    this.setState({
      // here we set our loading state to be true and this will show the spinner at the bottom
      loading: true
    });
    // first we try fetch
    try {
      // using the await keyword to wait for our response to come back
      const response = await fetch(
        `https://api.giphy.com/v1/gifs/search?api_key=lG3RqWNlDqMY7Dhnyezpnuq8fI51llTu&q=${searchTerm}&limit=25&offset=0&rating=PG&lang=en`
      );
      // here we convert our raw response into json data
      // const {data} gets the .data part of our response
      const {data} = await response.json();

      // here we check if the array of resultss is empty. 
      // if it is, we throw an error which will stop the code here and handle it in the catch area
      if (!data.length) {
        throw `Nothing found for ${searchTerm}`
      }

      // here we grab a random result from our images
      const randomGif = randomChoice(data)

      console.log({randomGif})
      console.log({data});

      this.setState((prevState, props) => ({
        ...prevState,
        // here we use our spread to take the previous gifs and spread them out and then add our new random gif onto the end
        gifs: [...prevState.gifs, randomGif],
        // we turn off our loading spinner again
        loading: false,
        hintText: `Hit enter to see more ${searchTerm}`
      }));

      // if our fetch fails, we catch it down here
    } catch (error) {
      this.setState((prevState, props) => ({
        ...prevState,
        hintText: error,
        loading: false
      }))
      console.log(error)
    }
  };

  // with create react app we can write our methods as arrow functions, so we don't need the constructor and bind
  handleChange = event => {
    const {value} = event.target
    // by setting the searchTerm in our state and also using that on the input as the value,
    // we have created what is called a controlled input
    this.setState((prevState, props) => ({
      // we take our old props and spread them out here
      ...prevState,
      // then we overwrite the ones we want after
      searchTerm: value,
      // setting hint text only when we have more that 2 characters in our input, otherwise we make it an empty string
      hintText: value.length > 2 ? `Hit enter to search ${value}` : ''
    }));
  };

  handleKeyPress = event => {
    const {value} = event.target
    // when we have two or more characters in our search box and have pressed enter, we want to run a search
    if (value.length > 2 && event.key === 'Enter') {
      // calling our searchGiphy function using the search term
      this.searchGiphy(value)
    }
  };

  // here we reset our state by clearing everything out and making it default again (like in our original state)
  clearSearch = () => {
    this.setState((prevState, props) => ({
      ...prevState,
      searchTerm: '',
      hintText: '',
      gifs: []
    }));
    // here we grab the input and then focus the cursor back onto it 
    this.textInput.focus();
  };

  render () {
    // const searchTerm is the same as this.state.searchTerm
    const { searchTerm, gifs } = this.state;
    // here we set a variable to see if we have any gifs
    const hasResults = gifs.length;
    return (
      <div className="page">
        <Header clearSearch={this.clearSearch} hasResults ={hasResults} />
        <div className="search grid">
          { /* {stack of gif images} */ }
          {/* here we loop over our array of gif images from our state and we create multiple videos from it */}

          {this.state.gifs.map(gif => (
            // we spread out all of our properties onto our Gif component
            <Gif {...gif} />
          ))}
          
          <input 
            className="input grid-item" 
            placeholder="Type something"
            onChange={this.handleChange}
            onKeyPress={this.handleKeyPress}
            value={searchTerm}
            ref={input => {
              this.textInput = input;
            }}
          />
        </div>
        {/* here we pass our userHint all our state using a spread */}
        <UserHint {...this.state} />
      </div>
    );
  }
}

export default App;
