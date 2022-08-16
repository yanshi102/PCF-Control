import { IInputs, IOutputs } from "./generated/ManifestTypes";

export class AgeControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {
    private _value: number;
    private _notifyOutputChanged: () => void;
    private labelElement: HTMLLabelElement;
    private inputElement: HTMLInputElement;
    private _container: HTMLDivElement;
    private _context: ComponentFramework.Context<IInputs>;
    private _refreshData: EventListenerOrEventListenerObject;

    public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container: HTMLDivElement): void {
        this._context = context;
        this._container = document.createElement("div");
        this._notifyOutputChanged = notifyOutputChanged;
        this._refreshData = this.refreshData.bind(this);

        // creating HTML elements for the input type range and binding it to the function which refreshes the control data
        this.inputElement = document.createElement("input");
        this.inputElement.setAttribute("type", "range");
        this.inputElement.addEventListener("input", this._refreshData);

        //setting the max and min values for the control.
        this.inputElement.setAttribute("min", "18");
        this.inputElement.setAttribute("max", "100");
        this.inputElement.setAttribute("class", "linearslider");
        this.inputElement.setAttribute("id", "linearrangeinput");

        // creating a HTML label element that shows the value that is set on the linear range control
        this.labelElement = document.createElement("label");
        this.labelElement.setAttribute("class", "LinearRangeLabel");
        this.labelElement.setAttribute("id", "lrclabel");

        // retrieving the latest value from the control and setting it to the HTMl elements.
        this._value = context.parameters.controlValue.raw!;
        this.inputElement.setAttribute("value", context.parameters.controlValue.formatted ? context.parameters.controlValue.formatted : "");
        this.labelElement.innerHTML = context.parameters.controlValue.formatted ? context.parameters.controlValue.formatted : "";

        // appending the HTML elements to the control's HTML container element.
        this._container.appendChild(this.inputElement);
        this._container.appendChild(this.labelElement);
        container.appendChild(this._container);
    }

    public refreshData(evt: Event): void {
        this._value = (this.inputElement.value as any) as number;
        this.labelElement.innerHTML = this.inputElement.value;
        this._notifyOutputChanged();
    }

    public updateView(context: ComponentFramework.Context<IInputs>): void {
        // storing the latest context from the control.
        this._value = context.parameters.controlValue.raw!;
        this._context = context;
        this.inputElement.setAttribute("value", context.parameters.controlValue.formatted ? context.parameters.controlValue.formatted : "");
        this.labelElement.innerHTML = context.parameters.controlValue.formatted ? context.parameters.controlValue.formatted : "";
    }

    public getOutputs(): IOutputs {
        return {
            controlValue: this._value
        };
    }

    public destroy(): void {
        this.inputElement.removeEventListener("input", this._refreshData);
    }
}