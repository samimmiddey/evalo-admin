export interface TelemetryDataPoint {
   time: string;
   current: number;
   baseline: number;
}

export interface MetricTile {
   value: string;
   label: string;
}

export interface AuthBrandCardData {
   title: string;
   subtitle: string;
   primaryMetric: {
      value: string;
      delta: string;
      comparison: string;
   };
   chartUnit: string;
   chartData: TelemetryDataPoint[];
   metrics: MetricTile[];
}

export interface AuthBrandData {
   headline: {
      prefix: string;
      highlight: string;
   };
   description: string;
   card: AuthBrandCardData;
   footer: {
      copyright: string;
      status: string;
   };
}

export interface InputData {
   name: string;
   type: string;
   label: string;
   placeholder: string;
}

export interface AuthFormData {
   title: string;
   description: string;
   emailInput: InputData;
   passwordInput: InputData;
   forgotPassword: string;
   submitButtonText: string;
}

export interface AuthData {
   form: AuthFormData;
   brand: AuthBrandData;
}
