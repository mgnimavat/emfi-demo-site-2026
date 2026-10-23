const aliases: Record<string, string> = {
  czechrepublic: "czechia",
  ivorycoast: "cotedivoire",
  russianfederation: "russia",
  unitedstatesofamerica: "unitedstates",
  republicofkorea: "southkorea",
  democraticpeoplesrepublicofkorea: "northkorea",
  unitedrepublicoftanzania: "tanzania",
  republicofserbia: "serbia",
  syrianarabrepublic: "syria",
  iranislamicrepublicof: "iran",
};

export function mapCountryKey(name: string) {
  const key = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z]/g, "");
  return Object.hasOwn(aliases, key) ? aliases[key] : key;
}

export function countryChangeColor(value: number | undefined, max: number) {
  if (value === undefined || !Number.isFinite(value)) return "#e7edf4";
  if (value === 0) return "#f0f3f6";
  const intensity = Math.min(1, Math.abs(value) / (max > 0 ? max : 1));
  const from = value > 0 ? [232, 245, 238] : [254, 237, 233];
  const to = value > 0 ? [44, 128, 94] : [180, 72, 65];
  return `rgb(${from.map((channel, i) => Math.round(channel + (to[i] - channel) * intensity)).join(",")})`;
}
