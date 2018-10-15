const args = process.argv.slice(2);
const filePath = args[0];

const fs = require('fs');

const tab = `    `;
const doubleTab = `${tab}${tab}`;
const tripleTab = `${doubleTab}${tab}`;

const componentFile = require(`${process.cwd()}/${filePath}`);
const store = {
    select: () => 'test',
};
const className = Object.keys(componentFile)[0];
const component = new componentFile[className]();
component._store = store;
component.ngOnInit();

const componentName =
    `${className.substring(0, 1).toLowerCase()}${className.substring(1)}`;

const observables = Object.keys(component).filter((prop) => (
    prop.charAt(prop.length - 1) === '$'
));
const observablesWithFirstCharUpperCase = observables.map((obs) => (
    `${obs[0].toUpperCase()}` + `${obs.substring(1, obs.length - 1)}`
));
const mockObservables = observablesWithFirstCharUpperCase.map((obs) => (
    `mock${obs}`
));
const mockSetups = mockObservables.map((mockObservable) => (
    `const ${mockObservable} = Observable.of({});`
));
const selectStatements = observablesWithFirstCharUpperCase.map((obs) => (
    `select${obs}`
));
const initComponentFunction = `init${className}(
            store,
        )`;

const ngOnInitResult = `
describe('ngOnInit', () => {
    const initNgOnInitData = () => {
        ${mockSetups.join(`\n${doubleTab}`)}
        const store = initMockStore();
        store.select = jest.fn()
            ${mockObservables.map((observable) => (
                `.mockReturnValueOnce(${observable})`
            )).join(`\n${tripleTab}`)};
        const ${componentName} = ${initComponentFunction};

        return {
            ${componentName},
            ${mockObservables.sort((a, b) => (
                a > b ? 1 : -1
            )).join(`,\n${tripleTab}`)},
            store,
        };
    };

    ${observables.map((obs, index) => (
    `test('Calls store.select with ${selectStatements[index]}', () => {
        const {
            ${componentName},
            store,
        } = initNgOnInitData();

        ${componentName}.ngOnInit();

        expect(store.select)
            .toHaveBeenCalledWith(${selectStatements[index]});
    });

    test('Sets ${obs} to the value from the store', () => {
        const {
            ${componentName},
            ${mockObservables[index]},
        } = initNgOnInitData();

        ${componentName}.ngOnInit();

        expect(${componentName}.${obs})
            .toBe(${mockObservables[index]});
    });
    `
    )).join(`\n${tab}`)}
});`;

const componentProtoType = Object.getPrototypeOf(component);
const properties = Object.getOwnPropertyNames(componentProtoType);
const componentFunctions =
    properties.filter((prop) => (
        typeof component[prop] === 'function' &&
        prop !== 'ngOnInit' &&
        prop !== 'constructor'
    ));

const functionResult = componentFunctions.map((funcName) => `
describe('${funcName}', () => {
    test('Dispatches a ${funcName} action to the store', () => {
        const store = initMockStore();
        const ${componentName} = ${initComponentFunction};

        ${componentName}.${funcName}();

        expect(store.dispatch)
            .toHaveBeenCalledWith(${funcName}());
    });
});
`).join('');

const result = `${ngOnInitResult}\n${functionResult}`;

console.log('result', result);

fs.appendFileSync(filePath.replace('.ts', '.spec.ts'), result);
