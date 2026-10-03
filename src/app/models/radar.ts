export interface RadarFrame {
  time: number;
  path: string;
}

export interface RadarResponse {
  host: string;
  radar: {
    /** Recent radar images, oldest first; the last entry is the latest. */
    past: RadarFrame[];
  };
}
