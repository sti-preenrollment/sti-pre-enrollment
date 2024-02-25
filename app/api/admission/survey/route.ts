import { NextResponse } from "next/server";
import supabase from "utils/supabase";

type Survey = {
  tv: boolean | null;
  radio: boolean | null;
  print: boolean | null;
  school_event: boolean | null;
  flyers: boolean | null;
  billboards: boolean | null;
  posters: boolean | null;
  destination: boolean | null;
  seminar: boolean | null;
  camp: boolean | null;
  website: boolean | null;
  social_media: boolean | null;
  referrals: boolean | null;
  others: boolean | null;
};

type Counts = {
  tv: number;
  radio: number;
  print: number;
  school_event: number;
  flyers: number;
  billboards: number;
  posters: number;
  destination: number;
  seminar: number;
  camp: number;
  website: number;
  social_media: number;
  referrals: number;
  others: number;
};

type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
};

export async function GET() {
  const { data: survey } = await supabase
    .from("survey")
    .select(
      "tv, radio, print, school_event, flyers, billboards, posters, destination, seminar, camp, website, social_media, referrals, others"
    );

  if (!survey) {
    return NextResponse.json({ message: "No survey found" }, { status: 404 });
  }

  function convertSurveyDataToChartData(surveyArray: Survey[]): ChartData {
    // Initialize an object to store the counts
    const counts: Counts = {
      tv: 0,
      radio: 0,
      print: 0,
      school_event: 0,
      flyers: 0,
      billboards: 0,
      posters: 0,
      destination: 0,
      seminar: 0,
      camp: 0,
      website: 0,
      social_media: 0,
      referrals: 0,
      others: 0,
    };

    // Iterate over the survey array and increment the counts
    for (let survey of surveyArray) {
      for (let key in survey) {
        if (survey[key as keyof Survey] === true) {
          counts[key as keyof Counts]++;
        }
      }
    }
    // Prepare the data for react-chartjs-2
    const data: ChartData = {
      labels: Object.keys(counts),
      datasets: [
        {
          label: "# of Votes",
          data: Object.values(counts),
        },
      ],
    };

    return data;
  }

  const surveyData = convertSurveyDataToChartData(survey);
  return NextResponse.json(surveyData, { status: 200 });
}
