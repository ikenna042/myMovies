import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class StorageService {


  constructor(private storage: Storage) {
    this.init();
  }

  async init() {
    const storage = await this.storage.create();
  }

  public getData(name: string){
    return this.storage.get(name);
  }

  public async setData(name: string, value) {
    return this.storage.set(`${ name }`, value);
  }
}
