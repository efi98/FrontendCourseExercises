import { inject, Injectable } from "@angular/core";
import { collection, collectionData, doc, Firestore, setDoc, deleteDoc} from "@angular/fire/firestore";
import { map, Observable } from "rxjs";
import { Flight } from "@types";

@Injectable({
    providedIn: "root",
})
export class FlightsService {
    firestore: Firestore = inject(Firestore);
    private flightsData: Observable<Flight[]> = collectionData(
        collection(this.firestore, "flights")
    ).pipe(map((data: any) => data.map((doc: Flight) => doc)));

    public get flights() {
        return this.flightsData;
    }

    public async addFlight(flight: Flight) {
        try {
            const flightRef = doc(collection(this.firestore, "flights"));
            flight.flight_id = flightRef.id;
            await setDoc(flightRef, flight);
        } catch (e: any) {
            alert(e.message);
        }
    }

    public async editFlight(flight: Flight) {
        try {
            const flightRef = doc(collection(this.firestore, "flights"), flight.flight_id);
            await setDoc(flightRef, flight);
        } catch (e: any) {
            alert(e.message);
        }
    }

    public async deleteFlight(flightId: string) {
        try {
            const flightRef = doc(this.firestore, "flights", flightId);
            await deleteDoc(flightRef);
        } catch (e: any) {
            alert(e.message);
        }
    }
}
