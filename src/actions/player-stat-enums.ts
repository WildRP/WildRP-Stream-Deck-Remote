export interface IPlayerStats {
    playerStamina:number,
    playerHealth:number,
    playerHunger:number,
    playerThirst:number,
    playerAlive:boolean,
    playerResSicknessPercent:number,
    playerTonicPercent:number,
    horseStamina:number,
    horseHealth:number,
    horseAlive:boolean,
    showTelegramNotification:boolean,
    playerIsInPvp:boolean
}

export enum PlayerStats {
	playerStamina = "playerStamina",
    playerHealth = "playerHealth",
    playerHunger = "playerHunger",
    playerThirst = "playerThirst",
    playerAlive = "playerAlive",
    playerResSicknessPercent = "playerResSicknessPercent",
    playerTonicPercent = "playerTonicPercent",
    horseStamina = "horseStamina",
    horseHealth = "horseHealth",
    horseAlive = "horseAlive",
    showTelegramNotification = "showTelegramNotification",
    playerIsInPvp = "playerIsInPvp"
}

export const PlayerStatSvg = `
<svg width="250" height="250" viewBox="-31.25 -31.25 312.5 312.5" version="1.1" xmlns="http://www.w3.org/2000/svg" >
<defs>
  <style>
	.a {
	  fill: {{color}};
	}

	.b{
	  fill:#231f20;
	}
  </style>
</defs>

<g class="image" >
{{#health}}
  <g id="health" transform="scale(0.4) translate(135, 155)">
	<path class="a" d="M179.343,48.735C177.141,45.3,146.968-.015,93.57,0,57.084.011,22.984,21.182,8.446,49.385-28.637,121.327,67.463,227.6,83.173,244.974a354.385,354.385,0,0,0,96.17,74.727,354.372,354.372,0,0,0,96.171-74.727c15.71-17.374,111.81-123.647,74.727-195.589C335.7,21.182,301.6.011,265.117,0,211.719-.015,181.546,45.3,179.343,48.735Z"/>
  </g>
{{/health}}

{{#hunger}}
  <g id="hunger" transform="scale(1.5) translate(30, 30)">
	<path class="a" d="M52.777,27.871c2.119-4.1,6.431-10.458,13.891-13.7a85.192,85.192,0,0,1,16.869-5.35.579.579,0,0,0,.325-.947L77.277.205A.571.571,0,0,0,76.6.054C74.54,1.023,64.9,5.811,58.521,13.343A32.448,32.448,0,0,0,51.69,27.492.58.58,0,0,0,52.777,27.871Z"/>
	<path class="a" d="M100.05,38.725C95.938,26.172,79.815,20.372,67.815,23.667s-16.706,8.941-16.706,8.941S46.4,26.961,34.4,23.667,6.28,26.172,2.168,38.725C-2.067,51.655-.681,66.509,11.58,82.961a150.332,150.332,0,0,0,17.882,19.294c3.294,2.823,15,5.588,17.412,3.294.3-.286.556-.528.782-.739a5.074,5.074,0,0,1,6.955.021c.215.2.455.44.733.718,2.765,2.765,14.118-.471,17.412-3.294A150.332,150.332,0,0,0,90.638,82.961C102.9,66.509,104.286,51.655,100.05,38.725Z"/>
  </g>
{{/hunger}}

{{#stamina}}
  <g id="stamina" transform="scale(0.5) translate(130, 125)">
	<polygon class="a" points="81.753 0 0 147.842 81.753 147.842 20.103 276.503 229.176 94.234 142.063 94.234 215.774 0 81.753 0"/>
  </g>
{{/stamina}}

{{#thirst}}
  <g id="thirst" transform="scale(0.5) translate(140, 100)">
	<path class="a" d="M100.574,0s16,50.353,44.235,91.294,63.529,79.769,55.059,144c-11.294,85.647-99.294,86.177-99.294,86.177s-88-.53-99.294-86.177c-8.47-64.231,26.823-103.059,55.059-144S100.574,0,100.574,0Z"/>
  </g>
{{/thirst}}

{{#telegram}}
  <g id="telegram" transform="scale(0.75) translate(70, 100)">
	<path class="a" d="M95.822,72.05,187.906,2.3A8.433,8.433,0,0,0,182.118,0H8.471A8.427,8.427,0,0,0,2.686,2.3l92.08,69.75A.876.876,0,0,0,95.822,72.05Z"/><path class="a" d="M190.576,8.237,124.023,58.65a.874.874,0,0,0-.1,1.307L190.1,127.742a8.439,8.439,0,0,0,.484-2.8V8.471C190.588,8.392,190.579,8.315,190.576,8.237Z"/><path class="a" d="M66.566,58.65.01,8.236c0,.078-.01.155-.01.235v116.47a8.439,8.439,0,0,0,.484,2.8L66.663,59.957A.874.874,0,0,0,66.566,58.65Z"/><path class="a" d="M119.445,62.118,95.822,80.012a.876.876,0,0,1-1.056,0L71.143,62.118a.874.874,0,0,0-1.153.086L2.711,131.14a8.433,8.433,0,0,0,5.76,2.272H182.118a8.437,8.437,0,0,0,5.76-2.272L120.6,62.2A.875.875,0,0,0,119.445,62.118Z"/>
  </g>
{{/telegram}}

{{#horseHealth}}
  <g id="horse-health" transform="scale(0.4) translate(135, 155)">
	<path class="a" d="M179.343,48.735C177.141,45.3,146.968-.015,93.57,0,57.084.011,22.984,21.182,8.446,49.385-28.637,121.327,67.463,227.6,83.173,244.974a354.385,354.385,0,0,0,96.17,74.727,354.372,354.372,0,0,0,96.171-74.727c15.71-17.374,111.81-123.647,74.727-195.589C335.7,21.182,301.6.011,265.117,0,211.719-.015,181.546,45.3,179.343,48.735Z"/>
	<path class="b" d="M218.844,242.3a76.745,76.745,0,0,1-79,0C88.02,211.148,77.773,175.091,76.03,140.231c-1.462-29.249,25.994-72.859,28.858-80.724a4.255,4.255,0,0,1,4-2.806h9.77a4.246,4.246,0,0,1,3.956,5.8C118.15,73.885,89.3,120.151,91.8,144c2.759,26.41,9.277,52.916,41.508,77.358a76.372,76.372,0,0,0,92.081,0c32.231-24.442,38.749-50.948,41.508-77.358,2.491-23.844-26.355-70.11-30.815-81.5a4.246,4.246,0,0,1,3.956-5.8h9.77a4.255,4.255,0,0,1,4,2.806c2.864,7.865,30.32,51.475,28.858,80.724C280.914,175.091,270.667,211.148,218.844,242.3Z"/>
  </g>
{{/horseHealth}}

{{#horseStamina}}
  <g id="horse-stamina" transform="scale(0.5) translate(130, 125)">
	<polygon class="a" points="81.753 0 0 147.842 81.753 147.842 20.103 276.503 229.176 94.234 142.063 94.234 215.774 0 81.753 0"/>
	<path class="b" d="M111.548,133.03a23.126,23.126,0,0,1-23.806,0c-15.616-9.387-18.7-20.252-19.229-30.757-.44-8.813,7.833-21.954,8.7-24.325a1.282,1.282,0,0,1,1.2-.845h2.944a1.279,1.279,0,0,1,1.192,1.747c-1.344,3.431-10.036,17.373-9.285,24.558.831,7.958,2.8,15.945,12.507,23.31a23.014,23.014,0,0,0,27.748,0c9.712-7.365,11.676-15.352,12.508-23.31.75-7.185-7.942-21.127-9.286-24.558a1.28,1.28,0,0,1,1.192-1.747h2.944a1.28,1.28,0,0,1,1.2.845c.863,2.371,9.137,15.512,8.7,24.325C130.252,112.778,127.164,123.643,111.548,133.03Z"/>
  </g>
{{/horseStamina}}
</g>

<g class="progress" transform="translate(125 125) rotate(90) scale(1.1)">
<circle r="115" cx="0" cy="0" stroke="#FFFFFFAA" stroke-width="24px" stroke-linecap="butt" stroke-dashoffset="722.2px" fill="transparent" stroke-dasharray="722.2px"></circle>
<circle class="fill" r="115" cx="0" cy="0" stroke="white" stroke-width="24px" stroke-linecap="butt" stroke-dashoffset="{{percent}}px" fill="transparent" stroke-dasharray="722.2px"></circle>
</g>
</svg>`;