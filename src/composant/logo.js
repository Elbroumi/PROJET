import React from 'react';
import './header.css'

 export default function Logo(props) {
  const annee = new Date().getFullYear();
  const mois = new Date().getMonth() + 1; 
  return (
    <div>
  <div className="header">
    <img src="/images/download.png" alt="YO NETWORK Logo" className="logo" />
  </div>
  
  <div className="container">
    <h2>Fiche de pointage <span className="highlight">YONETWORK</span></h2>
    <div className="info">
      <p className="centered"><strong>Nom de l'agent :</strong> {props.name}</p>
      <div className="right-align">
      <p><strong>Année :</strong> {annee}</p> 
      <p><strong>Mois :</strong> {mois}</p>   
      </div>
    </div>
  </div>
</div>

  
  );
}


    

