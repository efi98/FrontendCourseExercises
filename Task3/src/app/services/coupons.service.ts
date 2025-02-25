import { inject, Injectable } from '@angular/core';
import {
    addDoc,
    collection,
    collectionData,
    doc,
    docData,
    Firestore,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where
} from '@angular/fire/firestore';
import { catchError, map, Observable, of } from 'rxjs';
import { Coupon } from "@types";
import { convertTimestampToDate } from '../utilities/util';

@Injectable({
    providedIn: 'root',
})
export class CouponsService {
    private firestore = inject(Firestore);
    private couponsCollection = collection(this.firestore, 'coupons');

    public get coupon() {
        return (id: string): Observable<Coupon | null> => {
            const couponDoc = doc(this.firestore, `coupons/${id}`);
            return docData(couponDoc).pipe(
                map((data: any) => {
                    return {
                        ...data,
                        id,
                        startDate: convertTimestampToDate(data.startDate),
                        endDate: convertTimestampToDate(data.endDate)
                    };
                }),
                catchError((error) => {
                    console.error(`Error fetching coupon with ID ${id}:`, error);
                    return of(null); // Return null if an error occurs
                })
            );
        };
    }

    getCoupons(): Observable<Coupon[]> {
        return collectionData(this.couponsCollection, {idField: 'id'}).pipe(map((data: any) => {
            return data.map((item: any) => {
                return {
                    ...item,
                    startDate: convertTimestampToDate(item.startDate),
                    endDate: convertTimestampToDate(item.endDate)
                }
            });
        })) as Observable<Coupon[]>;
    }

    async addCoupon(coupon: Coupon): Promise<{ success: boolean; error?: string }> {
        // Check if the coupon code already exists
        const snapshot = await getDocs(query(this.couponsCollection, where("codeCoupon", "==", coupon.codeCoupon)));
        if (!snapshot.empty) {
            return {success: false, error: "This coupon code already exists in the system."};
        }

        // If not, add the coupon
        await addDoc(this.couponsCollection, coupon);
        return {success: true};
    }

    async editCoupon(coupon: Coupon): Promise<void> {
        if (!coupon.id) {
            throw new Error('Coupon must have an id to edit');
        }

        const couponDocRef = doc(this.firestore, `coupons/${coupon.id}`);

        await updateDoc(couponDocRef, {
            id: coupon.id,
            codeCoupon: coupon.codeCoupon,
            startDate: coupon.startDate,
            endDate: coupon.endDate,
            discountPercentage: coupon.discountPercentage,
            description: coupon.description,
            remainingUses: coupon.remainingUses,
            deleted: coupon.deleted
        });
    }

    async deleteCoupon(couponId: string): Promise<void> {
        const couponDoc = doc(this.firestore, `coupons/${couponId}`);
        await updateDoc(couponDoc, {deleted: true});
    }

    // Validate a coupon code (check if it exists, is valid, and not expired)
    async validateCoupon(codeCoupon: string): Promise<{ coupon?: Coupon; error?: string }> {
        const couponRef = doc(this.firestore, `coupons/${codeCoupon}`);
        const couponSnap = await getDoc(couponRef);

        if (!couponSnap.exists()) {
            return {error: "The code entered is invalid."}; // Coupon not found
        }

        const coupon = couponSnap.data() as Coupon;
        const now = new Date();

        if (now < coupon.startDate) {
            return {error: "The code entered is not yet valid."}; // Coupon not started
        }

        if (now > coupon.endDate) {
            return {error: "The code entered is expired."}; // Coupon expired
        }

        if (coupon.remainingUses <= 0) {
            return {error: "The code entered has reached its usage limit."}; // No remaining uses
        }

        return {coupon};
    }


    // Apply a coupon (calculate the new price)
    applyCoupon(coupon: Coupon, totalPrice: number): number {
        const discount = (coupon.discountPercentage / 100) * totalPrice;
        return totalPrice - discount;
    }

    // Update coupon usage (reduce remaining uses by 1)
    async updateCouponUsage(codeCoupon: string): Promise<void> {
        const couponRef = doc(this.firestore, `coupons/${codeCoupon}`);
        const couponSnap = await getDoc(couponRef);

        if (couponSnap.exists()) {
            const coupon = couponSnap.data() as Coupon;
            if (coupon.remainingUses > 0) {
                await updateDoc(couponRef, {
                    remainingUses: coupon.remainingUses - 1,
                });
            }
        }
    }
}
