import { CommonModule } from "@angular/common";
import { Component, inject } from "@angular/core";
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, } from "@angular/forms";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatSelectModule } from "@angular/material/select";
import { Coupon } from "@types";
import { first, Subscription } from "rxjs";
import { ActivatedRoute, Router } from "@angular/router";
import { MatRadioModule } from "@angular/material/radio";
import { convertDateToFormattedDate, dateValidator, endDateValidator } from "../../utilities/util";
import { CouponsService } from "../../services/coupons.service";
import { MatButtonModule } from "@angular/material/button";
import { MatIconModule } from "@angular/material/icon";

@Component({
    selector: "app-admin-coupon-form",
    imports: [
        CommonModule,
        MatFormFieldModule,
        MatRadioModule,
        ReactiveFormsModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatInputModule,
    ],
    templateUrl: "./admin-coupon-form.component.html",
    styleUrl: "./admin-coupon-form.component.scss",
})
export class AdminCouponFormComponent {
    coupon!: Coupon;
    couponForm!: FormGroup;
    couponService = inject(CouponsService);
    couponsSubscription!: Subscription;
    isEditMode: boolean = false;

    constructor(
        private formBuilder: FormBuilder,
        private router: Router,
        private route: ActivatedRoute
    ) {
        this.couponForm = this.formBuilder.group(
            {
                codeCoupon: ["", [Validators.required, Validators.maxLength(6), Validators.minLength(6)]],
                startDate: ["", [Validators.required, dateValidator()]],
                endDate: ["", [Validators.required, dateValidator(), endDateValidator]],
                discountPercentage: ["", [Validators.required, Validators.min(1), Validators.max(99)]],
                description: ["", Validators.required],
                remainingUses: ["", [Validators.required, Validators.min(1)]],
                deleted: [false]
            }
        );
    }

    ngOnDestroy(): void {
        this.couponsSubscription.unsubscribe();
    }

    ngOnInit(): void {
        let coupons_Observable = this.couponService.getCoupons().pipe(first());

        this.couponsSubscription = coupons_Observable.subscribe({
            next: (next) => {
                console.log('loaded!');
            },
            error: err => {
                console.log(err);
            },
            complete: () => {
                const couponId = this.route.snapshot.paramMap.get("coupon_id");
                if (couponId) {
                    this.isEditMode = true;
                    this.loadCoupon(couponId);
                }
            }
        });
    }

    loadCoupon(couponId: string) {
        this.couponService.coupon(couponId).pipe(first()).subscribe(data => {
            if (!data) {
                alert("Coupon not found.");
                this.router.navigate(["/admin-manage-coupons"]);
                return;
            }
            this.coupon = data;
            let coupon = {
                ...data,
                startDate: convertDateToFormattedDate(data.startDate),
                endDate: convertDateToFormattedDate(data.endDate)
            };
            console.log(coupon);
            this.couponForm.patchValue(coupon);
        });
    }

    submitForm() {
        if (this.couponForm.valid) {

            let {
                codeCoupon,
                deleted,
                endDate,
                startDate,
                remainingUses,
                discountPercentage,
                description
            } = this.couponForm.value;
            startDate = new Date(startDate);
            endDate = new Date(endDate);

            const couponData: Coupon = {
                codeCoupon,
                id: this.coupon?.id,
                deleted,
                description,
                discountPercentage,
                remainingUses,
                endDate,
                startDate
            };

            if (this.isEditMode) {
                this.couponService.editCoupon(couponData);
                alert("Coupon changes saved successfully!");
                this.router.navigate(["/admin-manage-coupons"]);
            } else {
                delete couponData.id;
                this.couponService.addCoupon(couponData).then((result) => {
                    if (result.error) {
                        alert(result.error);
                        return;
                    }
                    alert("Coupon added successfully!");
                    this.router.navigate(["/admin-manage-coupons"]);
                });
            }

        } else {
            // Mark all fields as touched to show validation messages
            this.couponForm.markAllAsTouched();
            alert("Please fill in all required fields before submitting.");
        }
    }
}
