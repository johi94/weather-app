export interface RadarFrame {
  time: number;
  path: string;
}

export interface RadarResponse {
  host: string;
  radar: {
    past: RadarFrame[];
  };
}
