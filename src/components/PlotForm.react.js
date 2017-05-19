import React from 'react';

import Plotly from 'plotly.js';

const mapUrl = 'https://raw.githubusercontent.com/jackparmer/dashboard-grid/master/test_data/eb_ob_ggplot2_restyled.json'
const obDeathsUrl = 'https://raw.githubusercontent.com/jackparmer/dashboard-grid/master/test_data/eb_ob_barchart.json'
const obDeathsCumulativeUrl = 'https://raw.githubusercontent.com/jackparmer/dashboard-grid/master/test_data/eb_ob_line.json'
const obTableUrl = 'https://raw.githubusercontent.com/jackparmer/dashboard-grid/master/test_data/eb_ob.csv'
const obTableCsvPath = '../../test_data/eb_ob.csv'

    var styles = {
    plotForm: { padding: '50px 100px', border: '1px solid #ccc', maxWidth: '700px',
                width: '50%', margin: '0 auto', borderRadius: '2px', maxHeight: '450px',
                position: 'absolute', left: 0, right: 0, top: '200px', bottom: 0,
                background: 'whitesmoke', height: '50%' },
    plotLinkInput: { width: '100%', padding: '10px', borderRadius: '4px',
                     border: '1px solid #ccc', margin: '10px 0' }
}

    class PlotForm extends React.Component {
        constructor(props) {
            super(props);
            this.state = {value: ''};

            this.handleFormInputChange = this.handleFormInputChange.bind(this);

            this.handleFormSubmit = this.handleFormSubmit.bind(this);
            this.handleFormClose = this.handleFormClose.bind(this);
        }

        handleFormInputChange(event) {
            this.setState({value: event.target.value});
        }

        handleFormSubmit(event) {
            event.preventDefault();

            var fig;
            var parent = this;
            var urlToFetch = this.state.value;

            if( urlToFetch.substr(urlToFetch.length -3).toLowerCase() != 'csv'  ){
                Plotly.d3.json( urlToFetch,
                                function(error, figure) {
                                    if( error ){
                                        console.log( error, figure );
                                        // maybe file is  a CSV instead                                                                                                                                                            
                                        Plotly.d3.csv( urlToFetch,
                                                       function(error, csvArray ) {
                                                           parent.props.handleSubmit( csvArray );
                                                       });
                                    }
                                    else{
                                        fig = figure;
                                        console.log('FIG LAYOUT', fig.layout);
                                        parent.props.handleSubmit( { data:fig.data, layout:fig.layout } );
                                    }
                                } );
            }
            else{
                Plotly.d3.csv( urlToFetch,
                               function(error, csvArray ) {
                                   parent.props.handleSubmit( csvArray );
                               });
            }

        }

        handleFormClose(event){
            this.props.handleClose();
        }

        render() {
            return (
                    <form onSubmit={this.handleFormSubmit} style={styles.plotForm}>
                    <label>Link to raw Plotly graph JSON:</label>
                    <input type="text" value={this.state.value}
                    onChange={this.handleFormInputChange} style={styles.plotLinkInput} />
                <input type="submit" value="Submit" className="button-primary" />
                    <button onClick={this.handleFormClose} style={styles.cornerIcon} >Close</button>
                    <p>Examples (copy / paste):</p>
                    <p>Map:<br/><a href="#">{ mapUrl }</a></p>
                    <p>Outbreak Deaths:<br/><a href="#">{ obDeathsUrl } </a></p>
                    <p>Outbreak Deaths (cumulative):<br/><a href="#">{ obDeathsCumulativeUrl } </a></p>
                    <p>CSV Table:<br/><a href="#">{ obTableUrl } </a></p>
            </form>
                    );
        }
    }

    export default PlotForm;