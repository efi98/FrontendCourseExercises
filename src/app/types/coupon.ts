export interface Coupon {
    id?: string;
    codeCoupon: string;
    startDate: Date;
    endDate: Date;
    discountPercentage: number;
    description: string;
    remainingUses: number;
    deleted: boolean;
}