# @cloudcomponents/cdk-website-monitor

> Cdk component to monitor websites

## Install

```bash
npm install --save @cloudcomponents/cdk-website-monitor
```

## How to use

```javascript
import { App, Stack, StackProps } from '@aws-cdk/core';
import { WebsiteMonitor } from '@cloudcomponents/cdk-website-monitor';

export class WebsiteMonitorStack extends Stack {
    public constructor(parent: App, name: string, props?: StackProps) {
        super(parent, name, props);

        const websiteMonitor = new WebsiteMonitor(this, 'WebsiteMonitor');

        websiteMonitor.watchService({
            serviceName: 'cloudcomponents',
            url: 'https://www.cloudcomponents.org',
            expression: 'rate(2 minutes)',
        });
    }
}
```

## License

[MIT](../../LICENSE)