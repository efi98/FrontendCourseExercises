import { inject, Injectable } from "@angular/core";
import { collection, collectionData, doc, Firestore, setDoc, deleteDoc, docData, query, where, getDocs} from "@angular/fire/firestore";
import { catchError, from, map, Observable, of } from "rxjs";
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

    public get flightsByFilters() {
        return (filters: { origin?: string; destination?: string; startDate?: Date; endDate?: Date }): Observable<Flight[]> => {
            const flightsCollection = collection(this.firestore, "flights");
            let queryConditions = [];

            if (filters.origin) {
                queryConditions.push(where("origin", "==", filters.origin));
            }
            if (filters.destination) {
                queryConditions.push(where("destination", "==", filters.destination));
            }
            if (filters.startDate) {
                const departureStr = filters.startDate.toISOString().split("T")[0];
                queryConditions.push(where("boarding_date", ">=", departureStr));
            }
            if (filters.endDate) {
                const arrivalStr = filters.endDate.toISOString().split("T")[0];
                queryConditions.push(where("arrival_date", "<=", arrivalStr));
            }

            const flightsQuery = query(flightsCollection, ...queryConditions);

            return from(getDocs(flightsQuery)).pipe(
                map(snapshot => snapshot.docs.map(doc => ({ ...doc.data(), flight_id: doc.id } as Flight))),
                catchError(error => {
                    console.error("Error fetching flights:", error);
                    return [[]];
                })
            );
        };
    }


    public get flight() {
        return (id: string): Observable<Flight | null> => {
            const flightDoc = doc(this.firestore, `flights/${id}`);
            return docData(flightDoc).pipe(
                catchError((error) => {
                    console.error(`Error fetching flight with ID ${id}:`, error);
                    return of(null); // Return null if an error occurs
                })
            ) as Observable<Flight | null>;
        };
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
