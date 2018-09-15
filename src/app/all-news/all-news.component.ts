import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import {  Router } from '@angular/router';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase , AngularFireList  } from 'angularfire2/database';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';
@Component({
  selector: 'app-all-news',
  templateUrl: './all-news.component.html',
  styleUrls: ['./all-news.component.css']
})
export class AllNewsComponent implements AfterViewInit {
  firedata = firebase.database().ref('/waiting');
  firedneed = firebase.database().ref('/device');
  Data: any;
  newsList: Observable<any[]>;
  itemsRef: AngularFireList<any>;
  constructor( public af: AngularFireDatabase, public router: Router, private fire: AngularFireAuth) {
    this.itemsRef = af.list('/waiting');
    this.newsList = this.itemsRef.snapshotChanges().map(changes => {
      return changes.map(c => ({
        key: c.payload.key,
        firstname: c.payload.val().firstname,
        lastname: c.payload.val().lastname,
        address: c.payload.val().address,
        infor: c.payload.val().infor,
        phone: c.payload.val().phone,
        hide: c.payload.val().hide,
        addBy: c.payload.val().addBy
         })
      );
    });
    console.log(this.newsList);
}
  ngAfterViewInit(): void {
    this.newsList.subscribe( data => {
      console.log(data);
      this.Data = data;
    });
  }
  del(item) {
    this.firedata.child(item).remove();
  }
  up(item) {
    console.log(item);
    this.firedneed.child(item.key).set({
      firstname: item.firstname,
      lastname: item.lastname,
      address: item.address,
      infor: item.infor,
      phone: item.phone,
      hide: item.hide,
      addBy: item.addBy,
    } ).then( () => {
      this.firedata.child(item.key).remove();
    });
  }

}
