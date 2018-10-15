/**
 * Ignore all this setup before the class. In a real application these would
 * all be imports from angular, rxjs and elsewhere in your app.
 */
const applyDiscount = () => null;
interface OnInit {}
interface Observable<T> {}
interface ExampleStoreItemInterface {};
interface Store<T> {
    dispatch: (action) => void;
    select: (selector: () => void) => Observable<ExampleStoreItemInterface[]>;
};
interface StateInterface {};
const selectExampleStoreItems = () => null;

export class ExampleComponent implements OnInit {
    public exampleStoreItems$: Observable<ExampleStoreItemInterface[]>;

    constructor(
        private _store: Store<StateInterface>,
    ) {}

    public ngOnInit() {
        this.exampleStoreItems$ = this._store.select(selectExampleStoreItems);
    }

    public applyDiscount() {
        this._store.dispatch(applyDiscount());
    }
}
