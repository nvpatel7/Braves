import { BattedBall, Batter, Pitcher } from "../interfaces/battedballs_interface";
import { PITCHERS_ENDPOINT, FILTERED_BATTEDBALLS_ENDPOINT, BATTERS_ENDPOINT } from "../constants/endpoints";

export const getPitchers = async (): Promise<Pitcher[]> => {
    try {
        const response = await fetch(
            PITCHERS_ENDPOINT, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        const data:Pitcher[] = await response.json();

        if (!response.ok) {
            const contentType = response.headers.get("Content-Type");
            if (contentType && contentType.includes("text/html")) {
                console.error("Received HTML instead of JSON:", data);
                throw new Error(`Unexpected HTML response: ${response.status} ${response.statusText}`);
            } else {
                throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
            }
        }
        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Failed to fetch pitchers:", error.message);
            throw new Error(`Failed to fetch pitchers: ${error.message}`);
        } else {
            console.error("An unexpected error occurred:", error);
            throw new Error("An unexpected error occurred");
        }
    }
}

export const getBatters = async (): Promise<Batter[]> => {
    try {
        const response = await fetch(
            BATTERS_ENDPOINT, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        const data:Batter[] = await response.json();

        if (!response.ok) {
            const contentType = response.headers.get("Content-Type");
            if (contentType && contentType.includes("text/html")) {
                console.error("Received HTML instead of JSON:", data);
                throw new Error(`Unexpected HTML response: ${response.status} ${response.statusText}`);
            } else {
                throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
            }
        }
        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Failed to fetch batters:", error.message);
            throw new Error(`Failed to fetch batters: ${error.message}`);
        } else {
            console.error("An unexpected error occurred:", error);
            throw new Error("An unexpected error occurred");
        }
    }
}

// get batted balls based on pitcher and/or batter selection. If no pitcher or batter is selected, return all batted balls.
// the pitcher and batter parameters are optional
// example url: /battedballs?pitcher=Mike Leake&batter=Yonder Alonso
export const getBattedBalls = async (pitcher?: string, batter?: string): Promise<BattedBall[]> => {
    try {
        let url = FILTERED_BATTEDBALLS_ENDPOINT;
        if (pitcher && batter) {
            url += `?pitcher=${pitcher}&batter=${batter}`;
        } else if (pitcher) {
            url += `?pitcher=${pitcher}`;
        } else if (batter) {
            url += `?batter=${batter}`;
        }

        const response = await fetch(
            url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            }
        );

        const data:BattedBall[] = await response.json();

        if (!response.ok) {
            const contentType = response.headers.get("Content-Type");
            if (contentType && contentType.includes("text/html")) {
                console.error("Received HTML instead of JSON:", data);
                throw new Error(`Unexpected HTML response: ${response.status} ${response.statusText}`);
            } else {
                throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
            }
        }
        return data;
    } catch (error) {
        if (error instanceof Error) {
            console.error("Failed to fetch batted balls:", error.message);
            throw new Error(`Failed to fetch batted balls: ${error.message}`);
        } else {
            console.error("An unexpected error occurred:", error);
            throw new Error("An unexpected error occurred");
        }
    }
}