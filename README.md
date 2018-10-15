# Auto gen angular store component unit tests

We generate a lot of basic jest unit tests for components that connect to the store.

This app saves time by allowing us to auto generate a lot of these based on the setup
of the component.

It assumed a component is an angular typescript component set up in the following way:

```typescript
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
```

And from this it will generate the following tests:

```typescript
describe('ngOnInit', () => {
    const initNgOnInitData = () => {
        const mockExampleStoreItems = Observable.of({});
        const store = initMockStore();
        store.select = jest.fn()
            .mockReturnValueOnce(mockExampleStoreItems);
        const exampleComponent = initExampleComponent(
            store,
        );

        return {
            exampleComponent,
            mockExampleStoreItems,
            store,
        };
    };

    test('Calls store.select with selectExampleStoreItems', () => {
        const {
            exampleComponent,
            store,
        } = initNgOnInitData();

        exampleComponent.ngOnInit();

        expect(store.select)
            .toHaveBeenCalledWith(selectExampleStoreItems);
    });

    test('Sets exampleStoreItems$ to the value from the store', () => {
        const {
            exampleComponent,
            mockExampleStoreItems,
        } = initNgOnInitData();

        exampleComponent.ngOnInit();

        expect(exampleComponent.exampleStoreItems$)
            .toBe(mockExampleStoreItems);
    });
    
});

describe('applyDiscount', () => {
    test('Dispatches a applyDiscount action to the store', () => {
        const store = initMockStore();
        const exampleComponent = initExampleComponent(
            store,
        );

        exampleComponent.applyDiscount();

        expect(store.dispatch)
            .toHaveBeenCalledWith(applyDiscount());
    });
});
```

This has to be done with ts-node as we're reading typescript to generate these
tests.

## Requirements
- Node v8+
- Npm v5+

## Usage

- `npm i --save-dev @chrisb-dev/auto-gen-store-component-unit-tests`

- Add a script to package.json to run script: `"auto-gen-organism-unit-tests": "ts-node  node_modules/@chrisb-dev/auto-gen-store-component-unit-tests/index.ts"`

- Run the script with a component connected to the store: `npm run auto-gen-organism-unit-tests ./src/organisms/basket/basket.component.ts`

- Alternatively, after installing, the script can just be run from the npm packages: `ts-node node_modules/@chrisb-dev/auto-gen-store-component-unit-tests/index.ts ./src/organisms/basket/basket.component.ts`

- In either case replace `./src/organisms/basket/basket.component.ts` with the path to the component you want to generate the data for.

## Development

You can use the example file to try this out in development. To do this run:
`ts-node index.ts ./example/example.ts`
