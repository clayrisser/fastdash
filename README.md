# fastdash

[![GitHub stars](https://img.shields.io/github/stars/codejamninja/fastdash.svg?style=social&label=Stars)](https://github.com/codejamninja/fastdash)

> multithreaded utility functions for node using worker threads

Please ★ this repo if you found it useful ★ ★ ★


## Features

* supports typescript
* customize max threads


## Benchmarks

fastdash is multithreaded and is faster for CPU intensive tasks
![Screenshot from 2019-03-26 03-26-49](https://user-images.githubusercontent.com/6234038/54982089-ea2c8700-4f77-11e9-869b-f75ac9ca7305.png)

lodash is single threaded and takes longer for CPU intensive tasks
![Screenshot from 2019-03-26 03-28-00](https://user-images.githubusercontent.com/6234038/54982097-f1ec2b80-4f77-11e9-92ad-2c54482ba1a1.png)


## Installation

```sh
npm install --save fastdash
```


## Dependencies

* [NodeJS](https://nodejs.org)


## Usage

Iteratee callback functions must be pure functions

### map

```js
import fast from 'fastdash';

async main() {
  const result = await fast.map([1, 2, 3], item => {
    return item + 1;
  });
  console.log(result); // [2, 3, 4]
}

main();
```


## Support

Submit an [issue](https://github.com/codejamninja/fastdash/issues/new)


## Screenshots

[Contribute](https://github.com/codejamninja/fastdash/blob/master/CONTRIBUTING.md) a screenshot


## Contributing

Review the [guidelines for contributing](https://github.com/codejamninja/fastdash/blob/master/CONTRIBUTING.md)


## License

[MIT License](https://github.com/codejamninja/fastdash/blob/master/LICENSE)

[Jam Risser](https://codejam.ninja) © 2019


## Changelog

Review the [changelog](https://github.com/codejamninja/fastdash/blob/master/CHANGELOG.md)


## Credits

* [Jam Risser](https://codejam.ninja) - Author


## Support on Liberapay

A ridiculous amount of coffee ☕ ☕ ☕ was consumed in the process of building this project.

[Add some fuel](https://liberapay.com/codejamninja/donate) if you'd like to keep me going!

[![Liberapay receiving](https://img.shields.io/liberapay/receives/codejamninja.svg?style=flat-square)](https://liberapay.com/codejamninja/donate)
[![Liberapay patrons](https://img.shields.io/liberapay/patrons/codejamninja.svg?style=flat-square)](https://liberapay.com/codejamninja/donate)
