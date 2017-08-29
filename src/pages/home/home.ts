import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { HttpClient, HttpHeaders } from '@angular/common/http';
import Dropbox from 'dropbox';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

	readonly url = 'https://api.dropboxapi.com/2/files/list_folder';

	accessToken: string = '';
	folder: string = '';

	resultsViaHttpClient: string[] = [];
	resultsViaDropboxSdk: string[] = [];
	errorViaHttpClient: string = '';
	errorViaDropboxSdk: string = '';

  	constructor(
  		public navCtrl: NavController,
  		private httpClient: HttpClient,
	) { }

	myOnClick( event: MouseEvent ): void {
      	this.resultsViaHttpClient = [];
      	this.resultsViaDropboxSdk = [];
      	this.errorViaHttpClient = '';
      	this.errorViaDropboxSdk = '';
		// VIA HttpClient
		this.showContentsViaHttpClient();
	    // VIA Dropbox SDK
	    this.showContentsViaDropboxSdk();
    }

    showContentsViaHttpClient() {
		 	const req = this.httpClient.post(
			 	this.url
			 	, {
			 		path: this.folder,
		      		recursive: false,
			 	}
			 	, {
	    			headers: new HttpHeaders()
	    			.set('Authorization', ('Bearer ' + this.accessToken)
	    			).append('Content-Type', 'application/json'),
	  			}
			 )
		    .subscribe(
		        response => {
		          	console.log(response);
		          	const entries = response['entries'];
		          	console.log(entries);
		          	const names = entries.map(entry => entry.name);
		          	console.log(names);
		          	this.resultsViaHttpClient = names;
		          	console.log(this.resultsViaHttpClient);
		        },
		        err => {
		  			if(err.error) {
		  				if(err.error.error_summary) {
		        			this.errorViaHttpClient = err.error.error_summary;
		  				} else {
		        			this.errorViaHttpClient = err.error;
		  				}
		  			} else {
		  				if(err.message) {
		        			this.errorViaHttpClient = err.message;
		  				} else {
		        			this.errorViaHttpClient = "ERROR";
		        		}
		  			}
		          	console.log("Error occured");
		          	console.log(err);
	        	},
	        	() => {
		          	console.log("Completion occured");
	        	}
	      	);    
	}

    showContentsViaDropboxSdk() {

    		let dbx = new Dropbox({ accessToken: this.accessToken });

			dbx.filesListFolder({path: this.folder})
		  	.then(		        
		  		response => {
		          	console.log(response);
		          	const entries = response.entries;
		          	console.log(entries);
		          	const names = entries.map(entry => entry.name);
		          	console.log(names);
		          	this.resultsViaDropboxSdk = names;
		          	console.log(this.resultsViaDropboxSdk);
		        }
	       	)
		  	.catch(		        
		  		err => {
		  			if(err.error) {
		  				if(err.error.error_summary) {
		        			this.errorViaDropboxSdk = err.error.error_summary;
		  				} else {
		        			this.errorViaDropboxSdk = err.error;
		  				}
		  			} else {
		        		this.errorViaDropboxSdk = "ERROR";
		  			}
	          		console.log("Error occured");
	          		console.log(err);
        		}
        	);
    }

}
