import {
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewEncapsulation
} from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepicker, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { distinctUntilChanged, map, ReplaySubject, takeUntil } from 'rxjs';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import _moment, { default as _rollupMoment, Moment } from 'moment';
import { isEqual, isNil } from 'lodash';
import { DatePickerFormatDirective } from "../../directives/date-picker-format.directive";

const moment = _rollupMoment || _moment;

export const Month_FORMATS = {
    parse: {
        dateInput: 'MM/YYYY',
    },
    display: {
        dateInput: 'MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

@Component({
    selector: 'app-date-picker',
    imports: [MatFormFieldModule, MatInputModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, DatePickerFormatDirective],
    providers: [provideMomentDateAdapter(Month_FORMATS)],
    templateUrl: './date-picker.component.html',
    styleUrl: './date-picker.component.scss',
    encapsulation: ViewEncapsulation.None
})
export class DatePickerComponent implements OnInit, OnChanges, OnDestroy {
    @Input() expandedMode: boolean = false;
    @Output() onDateRangeChanged: EventEmitter<{ start: Date, end: Date }> = new EventEmitter<{
        start: Date,
        end: Date
    }>();
    readonly range!: FormGroup;
    readonly rangeMonth!: FormGroup;
    readonly date = new FormControl(moment());
    private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

    constructor(private formBuilder: FormBuilder) {
        this.range = this.formBuilder.group({
            start: [null, Validators.required],
            end: [null]
        });

        this.rangeMonth = this.formBuilder.group({
            start: [moment(), Validators.required],
            end: [null]
        });
    }

    ngOnInit(): void {
        this.range.valueChanges.pipe(map((data: { start: any, end: any }) => {
                const date = {
                    start: moment(data.start).toDate(),
                    end: moment(data.end).toDate(),
                };
                return date;
            }),
            distinctUntilChanged((prev, curr) => isEqual(prev, curr)),
            takeUntil(this.destroyed$)).subscribe((data: any) => {
            if (this.range.get('start')?.value) {
                let {start, end} = data;
                this.onDateRangeChanged.emit({start, end});
            }
        });

        this.rangeMonth.valueChanges.pipe(map((data: { start: any, end: any }) => {
                const date = {
                    start: moment(data.start).startOf('month').toDate(),
                    end: moment(data.end).endOf('month').toDate(),
                };
                return date;
            }),
            distinctUntilChanged((prev, curr) => isEqual(prev, curr)),
            takeUntil(this.destroyed$)).subscribe((data: any) => {
            if (this.rangeMonth.get('start')?.value) {
                let {start, end} = data;
                this.onDateRangeChanged.emit({start, end});
            }
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (!isNil(changes['expandedMode'].currentValue)) {
            if (!this.expandedMode) {
                let data = this.range.value;
                const date = {
                    start: moment(data.start).toDate(),
                    end: moment(data.end).toDate(),
                };
                let {start, end} = date;
                this.onDateRangeChanged.emit({start, end});
            } else if (this.expandedMode) {
                let data = this.rangeMonth.value;
                const date = {
                    start: moment(data.start).startOf('month').toDate(),
                    end: moment(data.end).endOf('month').toDate(),
                };
                let {start, end} = date;
                this.onDateRangeChanged.emit({start, end});
            }
        }
    }

    ngOnDestroy(): void {
        this.destroyed$.next(true);
        this.destroyed$.complete();
    }

    setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>, input: 'start' | 'end') {
        let ctrl;
        if (input === 'start') {
            ctrl = this.rangeMonth.get('start');
        } else if (input === 'end') {
            ctrl = this.rangeMonth.get('end');
        }
        let ctrlValue = ctrl?.value ?? moment();
        ctrlValue.month(normalizedMonthAndYear.month());
        ctrlValue.year(normalizedMonthAndYear.year());
        ctrl?.setValue(ctrlValue);
        datepicker.close();
    }

    resetForms(): void {
        this.range.reset(null, {onlySelf: true, emitEvent: false});
        this.rangeMonth.reset(null, {onlySelf: true, emitEvent: false});
    }
}
