import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import React from 'react';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

function Header()
{
    return <div className='header'><h1>Header</h1></div>
}
function Body()
{
    return <div className='body'><h1>body</h1></div>
}
function Footer()
{
    return <div id='footer'><h1>footer</h1></div>
}
const display=(

  <>
  <Header/>
  <Body/>
  <Footer/>
  </>
)
root.render( 
 <App></App>
);