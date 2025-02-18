import { inject, Injectable } from "@angular/core";
import { Destination } from "../types";
import { map, Observable } from "rxjs";
import { collection, collectionData, deleteDoc, doc, Firestore, setDoc } from "@angular/fire/firestore";

@Injectable({
  providedIn: "root",
})
export class DestinationsService {
  firestore = inject(Firestore);
  destinationsData: Observable<Destination[]> = collectionData(
    collection(this.firestore, "destinations"),
    {
      idField: "id",
    }
  ).pipe(map((data: any) => data.map((doc: Destination) => doc)));

  public get destinations() {
    return this.destinationsData;
  }

  public async addDestination(destination: Destination) {
    try {
      const destinationRef = doc(collection(this.firestore, "destinations"));
      destination.destination_id = destinationRef.id;
      await setDoc(destinationRef, destination);
    } catch (e: any) {
      alert(e.message);
    }
  }

  public async editDestination(destination: Destination) {
    try {
      const destinationRef = doc(
        collection(this.firestore, "destinations"),
        destination.destination_id
      );
      await setDoc(destinationRef, destination);
    } catch (e: any) {
      alert(e.message);
    }
  }

  public async deleteDestination(destinationId: string) {
    try {
      const destinationRef = doc(this.firestore, "destinations", destinationId);
      await deleteDoc(destinationRef);
    } catch (e: any) {
      alert(e.message);
    }
  }
}