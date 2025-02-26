import { Component, inject, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, DatePipe } from '@angular/common';
import { Coupon } from "@types";
import { CouponsService } from "../../services/coupons.service";
import { Observable } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';


@Component({
    selector: 'app-admin-manage-coupons',
    imports: [MatTableModule, RouterModule, MatButtonModule, MatIconModule, CommonModule],
    templateUrl: './admin-manage-coupon.component.html',
    styleUrl: './admin-manage-coupon.component.scss',
    providers: [DatePipe],
})
export class AdminManageCouponComponent implements OnInit {
    couponService = inject(CouponsService);
    coupons: Observable<Coupon[]> = this.couponService.getCoupons();
    displayedColumns: string[] = ["codeCoupon", "discount", "startDate", "endDate", "remainingUses", "description", "deleted", "actions"];

    async deleteCoupon(id: string) {
        await this.couponService.deleteCoupon(id);
    }

    ngOnInit(): void {
        this.coupons.subscribe(coupon => {
            console.log(coupon);
        })
    }
}
