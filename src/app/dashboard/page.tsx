import Logout from "@/UI/components/Buttons/Logout";
import "../../styles/glare.css";
import { getServerSession, Session } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import SignIn from "@/UI/components/Buttons/SignIn";
import { doc, getDoc } from "firebase/firestore/lite";
import db from "@/db";
import { Reel } from "@/types";
import getPaddedDate from "@/utils/getPaddedDate";
import getPaddedTime from "@/utils/getPaddedTime";

export default async function Dashboard() {
    const session: Session | null = await getServerSession(authOptions)

    if (!session) {
        return <div className="h-screen w-screen flex justify-center items-center">
            <div>
                <p className="text-orange-200 text-lg font-semibold font-mono">Please sign in first !</p>
                <div className="mt-6 ml-14">
                    <SignIn />
                </div>
            </div>
        </div>
    }

    let reels: Reel[]
    const docRef = doc(db, process.env.COLLECTION || "reels history collection", session?.user?.email!)
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        reels = docSnap.data()["reels"] || []
    } else {
        reels = []
    }

    return <>
        <div className="top-right-glare"></div>
        
        <div className="absolute top-5 left-280">
            <Logout />
        </div>

        {/* parent container of all reels */}
        <div className="absolute top-35 left-15">

            {/* header */}
            <div className="flex gap-210 font-mono text-white text-2xl font-semibold px-8 bg-black/60 rounded-lg">
                <div className="flex gap-20 py-4">
                    <div>Date</div>
                    <div>Time</div>
                </div>
                <div className="py-4">
                    Reels
                </div>
            </div>

            {/* all reels */}
            <div className="mt-6">
                {reels.map((reel, key) => {
                    {/* each reel */ }
                    return <div key={key} className="flex justify-between text-white text-sm px-8 bg-black/30 rounded-lg mb-1">
                        <div className="flex gap-12 py-2">
                            <div>{getPaddedDate(reel.date)}</div>
                            <div>{getPaddedTime(reel.time)}</div>
                        </div>
                        <div className="py-2 hover:underline hover:text-blue-300">
                            <a target="_blank" href={reel.reelUrl}>{reel.reelUrl}</a>
                        </div>
                    </div>
                })}
            </div>

        </div>
    </>
}