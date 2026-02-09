import { useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { UserType } from "../post.types";
import { getUserByIdApi, updateUserApi } from "./user.posts";
import { selectUsers } from "./User.selectors";
import { updateUserSlice } from "./user.slice";
import { selectAuth } from "../redux/auth/auth.selectors";
import { setUser } from "../redux/auth/auth.slice";
import * as React from 'react';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { Grid, Link } from "@mui/material";
import { getSession } from "../auth/utils";

export default function PersonalZone() {
    const currentUser = useSelector(selectAuth);
    const usersArr = useSelector(selectUsers);
    const authuser=getSession();
    const dispatch = useDispatch();
    const [email, setEmail] = useState<string>(authuser?.user?.email || "");
    const [password, setPassword] = useState<string>(authuser?.user?.password || "");
    const [userFullName, setUserFullName] = useState<string>(authuser?.user?.username || "");
    const [userMin, setMin] = useState<string>(authuser?.user?.min || "");
    const [showFormLogin, setShowFormLogin] = useState(false);
    const [expanded, setExpanded] = useState(false);

    const handleExpansion = () => {
        setExpanded((prevExpanded) => !prevExpanded);
    };

    const update = async (fullName: string, min: string, email: string, password: string) => {
        try {
            const user: UserType = {
                id: currentUser.user!.id,
                username: fullName,
                min: min,
                email: email,
                password: password,
                profilePicturePath: currentUser.user!.profilePicturePath,
                token: currentUser.user!.token,
                profilePicture: undefined,
            };
            await updateUserApi(user, currentUser.user!.id);
            const index = usersArr.users.findIndex(item => item.id === user.id);
            const res = [...usersArr.users];
            const newUser = await getUserByIdApi(user.id);
            res[index] = newUser;
            dispatch(updateUserSlice([...res]));
            dispatch(setUser(newUser));
        } catch (error) {
            console.error(error);
            alert('Sorry, we encountered a problem. Please try again.');
        }
    };
    console.log(currentUser?.user?.profilePictureData.fileContents)

    const showDetails = () => {
        setShowFormLogin(!showFormLogin);
    };
// useEffect(() => {
//      console.log(currentUser.user)
//    }, []);
    return (
        <>
            <div className="main-div-profile">
                <Stack>
 <Avatar
    sx={{ width: 150, height: 150, marginTop: 3, marginLeft: 15 }}
src={`data:image;base64,${currentUser?.user?.profilePictureData.fileContents || ""}`}>
    {/* אם אין תמונה, יוצגו האותיות הראשונות של השם */}
    {currentUser.user?.username?.charAt(0).toUpperCase()}
</Avatar>
                </Stack>
                <h1>{currentUser.user?.username}</h1>
                <Typography variant="body1" sx={{ marginTop: 2 }}>
                    שלום וברוך הבא לאזור האישי שלך! אנחנו שמחים לראות אותך כאן ורוצים להזכיר לך שאם אתה מאמן כושר ויש לך ידע וניסיון שיכולים לתרום לקהילה שלנו, נשמח אם תצטרף אלינו כמאמן באתר. על ידי הצטרפותך למאמני הכושר שלנו, תוכל להעלות תרגילי התעמלות, לשתף טיפים ומדריכים ולסייע למתאמנים להשיג את המטרות שלהם.
                    הצטרפותך תאפשר לך:
                    <ul>
                        <li>לשתף את הידע והניסיון שלך עם קהל רחב של מתאמנים.</li>
                        <li>ליצור תוכניות אימון מותאמות אישית ולהציג את התרגילים המועדפים עליך.</li>
                        <li>לקבל חשיפה רחבה כמאמן כושר מקצועי ולבנות את המוניטין שלך.</li>
                    </ul>
                    אם אתה מעוניין להצטרף, פשוט לחץ על הקישור הבא ותתחיל לשתף את התרגילים שלך עם הקהילה שלנו. אנחנו מצפים לראות את התרומה הייחודית שלך ולהפוך את האתר למקום שכולנו יכולים ללמוד ולהתפתח בו.
                    <br />
                    <Grid item>
                <Link href="/coachSignup" variant="body2">
                {"לחץ כאן להצטרפות והתחלת שיתוף תרגילים"}
              </Link>
            </Grid>
                </Typography>
                <div>
                    <Accordion expanded={expanded} onChange={handleExpansion}>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1-content"
                            id="panel1-header"
                        >
                            <Typography>עדכון פרופיל</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                <div className="form-container">
                                    <form className="registration-form">
                                        <input
                                            onChange={(e) => setUserFullName(e.target.value)}
                                            type="text"
                                            value={userFullName}
                                            name="userFullName"
                                            placeholder={authuser?.user?.username}
                                        />
                                        <select
                                            value={userMin}
                                            onChange={(e) => setMin(e.target.value)}
                                        >
                                            <option value="נקבה">נקבה</option>
                                            <option value="זכר">זכר</option>
                                        </select>
                                        <input
                                            onChange={(e) => setEmail(e.target.value)}
                                            type="email"
                                            value={email}
                                            name="email"
                                            placeholder={authuser?.user?.email}
                                        />
                                        {/* <input
                                            onChange={(e) => setPassword(e.target.value)}
                                            type="password"
                                            value={password}
                                            name="password"
                                            placeholder={currentUser.user?.password}
                                        /> */}
                                    </form>
                                    <button
                                        className="submit-button"
                                        onClick={() => update(userFullName, userMin, email, password)}
                                        type="submit"
                                    >
                                        עדכון
                                    </button>
                                    <br />
                                </div>
                            </Typography>
                        </AccordionDetails>
                    </Accordion>
                    {/* <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2-content"
                            id="panel2-header"
                        >
                            <Typography>רשימת מועדפים</Typography>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Typography>
                                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.
                            </Typography>
                        </AccordionDetails>
                    </Accordion> */}
                </div>
            </div>
        </>
    );
}
