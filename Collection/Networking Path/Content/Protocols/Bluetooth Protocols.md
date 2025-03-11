**Data Link Layer** or **Application Layer** based on their functionality.
### Bluetooth Protocol Stacks

Bluetooth protocols are categorized into two main stacks:

1. **Controller Stack** – Handles low-level operations such as radio communication, packet handling, and encryption.
2. **Host Stack** – Manages high-level communication, service discovery, and application-layer interactions.

|**Controller Stack Protocols**|**Description**|
|---|---|
|**LMP** (Link Management Protocol)|Manages link setup, authentication, encryption, and power control.|
|**LE LL** (Low Energy Link Layer)|Handles BLE advertisement, scanning, connection, and security.|
|**SCO** (Synchronous Connection-Oriented Link)|Ensures real-time voice data transmission with reserved time slots.|
|**ACL** (Asynchronous Connection-Less Link)|Standard data link using polling TDMA for packet transfer.|
|**HCI** (Host Controller Interface)|Defines the interface between the host stack and controller hardware.|

|**Host Stack Protocols**|**Description**|
|---|---|
|**L2CAP** (Logical Link Control and Adaptation Protocol)|Manages data multiplexing, segmentation, and reassembly.|
|**RFCOMM** (Radio Frequency Communication)|Emulates serial port communication over Bluetooth.|
|**SDP** (Service Discovery Protocol)|Allows devices to discover available Bluetooth services.|
|**AVDTP** (Audio/Video Distribution Transport Protocol)|Handles streaming of multimedia data.|
|**A2DP** (Advanced Audio Distribution Profile)|Supports high-quality audio streaming.|
|**HID** (Human Interface Device)|Enables input devices like keyboards, mice, and game controllers.|
|**OBEX** (Object Exchange)|Supports binary object exchange (e.g., file transfer).|
|**GATT** (Generic Attribute Profile)|Manages BLE data structure and service interactions.|
|**ATT** (Attribute Protocol)|Defines how BLE devices store and access data.|
|**SMP** (Security Manager Protocol)|Manages pairing, encryption, and authentication for BLE.|
|**BNEP** (Bluetooth Network Encapsulation Protocol)|Supports networking over Bluetooth (e.g., PAN profile).|
|**TCS** (Telephony Control Protocol)|Controls call setup and management for voice communication.|
|**AVCTP** (Audio/Video Control Transport Protocol)|Used for remote control of audio/video devices.|