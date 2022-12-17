// directly taken from https://codesandbox.io/s/scrollwarp-ed7vht
// other sandbox (not used, but for referring) https://codesandbox.io/s/scrollwarp-with-text-x8heqe?file=/src/App.tsx

import { useScroll, a } from "@react-spring/web";

import { DefaultLayout } from "@/default-layout";
import { ScrollWarp } from "@/elements/scroll-warp";
import { useVelocity } from "@/uff/use-velocity";
import { clamp } from "@/uff/clamp";

export const ScrollWarpImages = () => {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);

  const scale = velocity.to((v) => 1 - Math.abs(v) / 30000).to(clamp(0.4, 1));

  return (
    <DefaultLayout className="grid gap-24 justify-center py-2">
      <div>Doesn't work properly on Firefox. Use Chrome to test this.</div>
      {photos.map((photo) => (
        <a.div key={photo.id} style={{ scale }} className="flex justify-center">
          <ScrollWarp velocity={velocity} className="w-[640px] h-[320px] block">
            <img
              className="h-full w-full object-cover"
              src={`https://picsum.photos/id/${photo.id}/600/800`}
            />
          </ScrollWarp>
        </a.div>
      ))}
    </DefaultLayout>
  );
};

const photos = [
  {
    id: "1075",
    author: "Verne Ho",
    width: 4858,
    height: 3239,
    url: "https://unsplash.com/photos/dccIfU1V1VU",
    download_url: "https://picsum.photos/id/1075/4858/3239",
  },
  {
    id: "1076",
    author: "Samuel Zeller",
    width: 4835,
    height: 3223,
    url: "https://unsplash.com/photos/WlD3vixTVUg",
    download_url: "https://picsum.photos/id/1076/4835/3223",
  },
  {
    id: "1077",
    author: "Maico Amorim",
    width: 3000,
    height: 1995,
    url: "https://unsplash.com/photos/SJWPKMb9u-k",
    download_url: "https://picsum.photos/id/1077/3000/1995",
  },
  {
    id: "1078",
    author: "Vladimir Kudinov",
    width: 3000,
    height: 2000,
    url: "https://unsplash.com/photos/KBX9XHk266s",
    download_url: "https://picsum.photos/id/1078/3000/2000",
  },
  {
    id: "1079",
    author: "Kamesh Vedula",
    width: 4496,
    height: 3000,
    url: "https://unsplash.com/photos/ISL7czxIP-k",
    download_url: "https://picsum.photos/id/1079/4496/3000",
  },
  {
    id: "108",
    author: "Florian Klauer",
    width: 2000,
    height: 1333,
    url: "https://unsplash.com/photos/t1mqA3V3-7g",
    download_url: "https://picsum.photos/id/108/2000/1333",
  },
  {
    id: "1080",
    author: "veeterzy",
    width: 6858,
    height: 4574,
    url: "https://unsplash.com/photos/OJJIaFZOeX4",
    download_url: "https://picsum.photos/id/1080/6858/4574",
  },
  {
    id: "1081",
    author: "Julien Moreau",
    width: 5512,
    height: 3708,
    url: "https://unsplash.com/photos/688Fna1pwOQ",
    download_url: "https://picsum.photos/id/1081/5512/3708",
  },
  {
    id: "1082",
    author: "Lukas Budimaier",
    width: 5416,
    height: 3611,
    url: "https://unsplash.com/photos/JzkgpML_8XI",
    download_url: "https://picsum.photos/id/1082/5416/3611",
  },
  {
    id: "1083",
    author: "Sweet Ice Cream Photography",
    width: 5472,
    height: 3648,
    url: "https://unsplash.com/photos/fwsvUxNgLRs",
    download_url: "https://picsum.photos/id/1083/5472/3648",
  },
  {
    id: "1084",
    author: "Jay Ruzesky",
    width: 4579,
    height: 3271,
    url: "https://unsplash.com/photos/h13Y8vyIXNU",
    download_url: "https://picsum.photos/id/1084/4579/3271",
  },
  {
    id: "109",
    author: "Zwaddi",
    width: 4287,
    height: 2392,
    url: "https://unsplash.com/photos/YvYBOSiBJE8",
    download_url: "https://picsum.photos/id/109/4287/2392",
  },
  {
    id: "11",
    author: "Paul Jarvis",
    width: 2500,
    height: 1667,
    url: "https://unsplash.com/photos/Cm7oKel-X2Q",
    download_url: "https://picsum.photos/id/11/2500/1667",
  },
  {
    id: "110",
    author: "Kenneth Thewissen",
    width: 5616,
    height: 3744,
    url: "https://unsplash.com/photos/D76DklsG-5U",
    download_url: "https://picsum.photos/id/110/5616/3744",
  },
  {
    id: "111",
    author: "Gabe Rodriguez",
    width: 4400,
    height: 2656,
    url: "https://unsplash.com/photos/eLUegVAjN7s",
    download_url: "https://picsum.photos/id/111/4400/2656",
  },
  {
    id: "112",
    author: "Zugr",
    width: 4200,
    height: 2800,
    url: "https://unsplash.com/photos/kmF_Aq8gkp0",
    download_url: "https://picsum.photos/id/112/4200/2800",
  },
  {
    id: "113",
    author: "Zugr",
    width: 4168,
    height: 2464,
    url: "https://unsplash.com/photos/yZf1quatKCA",
    download_url: "https://picsum.photos/id/113/4168/2464",
  },
  {
    id: "114",
    author: "Brian Gonzalez",
    width: 3264,
    height: 2448,
    url: "https://unsplash.com/photos/llYg8Ni43fc",
    download_url: "https://picsum.photos/id/114/3264/2448",
  },
  {
    id: "115",
    author: "Christian Hebell",
    width: 1500,
    height: 1000,
    url: "https://unsplash.com/photos/A6S-q3D67Ss",
    download_url: "https://picsum.photos/id/115/1500/1000",
  },
  {
    id: "116",
    author: "Anton Sulsky",
    width: 3504,
    height: 2336,
    url: "https://unsplash.com/photos/YcfCXxo7rpc",
    download_url: "https://picsum.photos/id/116/3504/2336",
  },
];
