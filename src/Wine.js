import React, {Component} from "react";

class Wine extends Component {
  constructor(props) {
    super([props]);
    this.wines = [];
  }

  componentDidMount() {
    return fetch(`${process.env.REACT_APP_BACKEND_URL}/rewine/backend/wines`)
           .then(resp => resp.json())
           .then(backend => {
                console.log(backend);
                backend.map((p, index) => {
                let newWine = this.wines;
                newWine.push({id: index, image: p.wineId, name: p.name, origin: p.origin});
                
                this.setState({wines: newWine});
                });
      });
  }

  render() {
    return (
      <div className="App">
      <h1>Wine List</h1>

       {this.wines.map(element => {
          return (
        <div class="gallery">
              <div class="desc">
                <p>{element.name}</p>
                <p>{element.origin}</p>
              </div>
        </div>
          )
        })}
    </div>
    )
  }
}

export default Wine;
