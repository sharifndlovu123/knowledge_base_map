
Here's a comparison of notable instant messaging protocols, categorized by their encryption support:

**Protocols Without Built-in End-to-End Encryption:**

|Protocol Name|Description|
|---|---|
|**IRC** (Internet Relay Chat)|One of the oldest instant messaging protocols, facilitating real-time text communication. It lacks native end-to-end encryption but supports TLS for server-client encryption.|
|**XMPP** (Extensible Messaging and Presence Protocol)|An open-standard communication protocol for message-oriented middleware. While it supports server-to-server and client-to-server encryption (e.g., via TLS), end-to-end encryption requires additional extensions like OMEMO or OpenPGP.|

**Protocols With Built-in End-to-End Encryption:**

|Protocol Name|Description|
|---|---|
|**Signal Protocol**|Designed for asynchronous messaging with strong end-to-end encryption, used by the Signal app and other platforms.|
|**Matrix**|An open communication protocol that supports real-time communication with end-to-end encryption as a default feature for private conversations.|
|**Briar**|A peer-to-peer messaging protocol focusing on security and privacy, offering built-in end-to-end encryption without relying on central servers.|

_Note: Some protocols, such as XMPP, can implement end-to-end encryption through extensions or additional features, but they do not include it by default._