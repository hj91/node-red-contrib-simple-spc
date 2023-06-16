# Node-RED SPC Node

The Node-RED SPC Node provides statistical process control (SPC) functionality for Node-RED. It can be used to calculate the average, upper control limit (UCL), lower control limit (LCL), and out-of-control status of a series of data points.

## What is SPC?

Statistical process control (SPC) is a method for monitoring and controlling a process. It uses statistical techniques to identify changes in the process that may indicate a need for corrective action.

SPC works by collecting data on the process and then using that data to calculate the average, upper control limit (UCL), and lower control limit (LCL). The average is the center of the process, and the UCL and LCL are the boundaries that define the acceptable range of variation for the process.

If a data point falls outside of the UCL or LCL, then the process is considered to be out of control. This indicates that there has been a change in the process that needs to be investigated and corrected.

## Features

* Calculates the average, upper control limit (UCL), lower control limit (LCL), and out-of-control status of a series of data points.
* Can be used to monitor and control a process.
* Can be used to identify changes in a process that may indicate a need for corrective action.

## Installation

To install the Node-RED SPC Node, simply run the following command:

```
npm install node-red-contrib-spc
```

Once the node is installed, you can add it to your Node-RED flow by dragging and dropping it onto the canvas.

## License

This node is licensed under the GNU General Public License, version 3 (GPL-3.0). For more information, please see the LICENSE file.

## Author

This node was created by Harshad Joshi.

## GitHub repo info

The source code for this node is available on GitHub:

```
https://github.com/hj91/node-red-contrib-spc
```

## Changelog for SPCNode (Statistical Process Control Node)

### Version 2.0 (June 16, 2023)

### Added
- Introduced a new configurable "Timer" setting that allows users to set the duration (in seconds) before the node goes into an "out of control" state. This functionality is implemented through a timer that starts when an out of control state is detected and stops when the control state is regained. 
- Added error handling to ensure that the payload is a number and provide appropriate feedback if not.

### Improved
- Enhanced the status message to indicate the time that the process has been out of control, based on the new "Timer" setting.

## Version 1.0 (Initial Release)

### Added
- SPCNode for statistical process control in industrial automation processes. 
- Performs a moving range SPC calculation on a stream of individual values.
- Outputs average, upper control limit (UCL), lower control limit (LCL), and a flag indicating if the current value is out of control.


