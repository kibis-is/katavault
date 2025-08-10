interface AVMSignRawMessageParameters {
  message: string | Uint8Array;
  privateKey: Uint8Array;
}

export default AVMSignRawMessageParameters;
