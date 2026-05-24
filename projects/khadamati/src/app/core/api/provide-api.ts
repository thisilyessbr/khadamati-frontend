import { EnvironmentProviders, makeEnvironmentProviders } from "@angular/core";
import {Configuration, ConfigurationParameters} from '@api/configuration';
import {BASE_PATH} from '@api/variables';



// Returns the service class providers, to be used in the [ApplicationConfig](https://angular.dev/api/core/ApplicationConfig).
export function provideApi(configOrBasePath: string | ConfigurationParameters): EnvironmentProviders {
    return makeEnvironmentProviders([
        typeof configOrBasePath === "string"
            ? { provide: BASE_PATH, useValue: configOrBasePath }
            : {
                provide: Configuration,
                useValue: new Configuration({ ...configOrBasePath }),
            },
    ]);
}
