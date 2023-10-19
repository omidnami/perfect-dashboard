import Header from '@/Components/header'
import Menu from '@/Components/menu'
import { Avatar, Box, Card, CardActions, CardContent, CircularProgress, Divider, Grid, LinearProgress, List, ListItem, ListItemContent, ListItemDecorator, SvgIcon, Typography } from '@mui/joy'
import { Line, Bar } from 'react-chartjs-2';
import Container from '@/Layouts/Continer';
import Chart from 'chart.js/auto';

import {CategoryScale} from 'chart.js'; 
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import useFetch from '@/Hooks/useFetch';
Chart.register(CategoryScale);

export default function Home() {
  const router = useRouter()
  const [view, setView] = useState<any>({d1:0,d2:0,d3:0,d4:0,d5:0,d6:0,d7:0,d8:0,d9:0,d10:0,today:0,all:0})
  const [social, setSocial] = useState<any>({})
  const [comment, setComment] = useState<any[]>([])
  
  const {response, postData} = useFetch()
  const data = {
    labels: ['10 روز قبل', '9 روز قبل', '8 روز قبل', '7 روز قبل', '6 روز قبل', '5 روز قبل', '4 روز قبل', '3 روز قبل', '2 روز قبل', 'دیروز'],
    
    datasets: [
      {
        label: 'بازدید کننده',
        data: [view.d10, view.d9, view.d8, view.d7, view.d6, view.d5, view.d4, view.d3, view.d2, view.d1],
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',

        ],
        borderWidth: 1
      }
    ]
  };
  const options = {
    maintainAspectRatio: false,
    responsive: true,
    width: '100%',
    height: 500 
  };

  useEffect(() => {
    postData('dashboard/default',null)
  },[])

  useEffect(() => {
    if (response) {
      setView(response.view)
      setSocial(response.social)
      setComment(response.comment)
    }
        document.body.classList.remove('loading')

  }, [response])

  return (
    <main>
      <Menu />
      <Container>
          <Header />
          <Box component='section'>
            <Grid container spacing={1.5}>
              <Grid xs={12} sm={12} md={8} lg={8}>
                <Card className="card">
                  <Bar data={data} style={{width:'100%', height:'500px'}}/>
                </Card>
              </Grid> 

              <Grid xs={12} sm={12} md={4} lg={4}>
              <Card className='mb-2' variant="solid" color="primary" invertedColors>
                  <CardContent orientation="horizontal">
                    {/* <CircularProgress size="lg" determinate value={100}>
                      100+
                    </CircularProgress> */}
                    <CardContent>
                      <Typography level="body-md">بازدید امروز</Typography>
                      <Typography level="h2" sx={{textAlign:'left'}}> {view.today} نفر </Typography>
                    </CardContent>
                  </CardContent>
                  <CardActions>
                  </CardActions>
              </Card>  
              <Card className='mb-2' variant="solid" color="primary" invertedColors>
                  <CardContent orientation="horizontal">
                    {/* <CircularProgress size="lg" determinate value={100}>
                      100+
                    </CircularProgress> */}
                    <CardContent>
                      <Typography level="body-md">بازدید کل</Typography>
                      <Typography level="h2" sx={{textAlign:'left'}}> {view.all} نفر </Typography>
                    </CardContent>
                  </CardContent>
                  <CardActions>
                  </CardActions>
              </Card>  
              </Grid> 

              <Grid xs={12} sm={12} md={8} lg={8}>
              <Card className="card"
              >
                <h3>آخرین دیدگاه ها</h3>
                <Divider />
                <div
                              style={{minHeight:'500px', maxHeight:'500px', overflow:'auto'}}

                >

                  {
                    comment.map((v:any) => {
                      return (
                        <>
                              <List
                                aria-labelledby="ellipsis-list-demo"
                                sx={{ '--ListItemDecorator-size': '56px' }}
                              >
                                <ListItem>
                                  <ListItemDecorator>
                                    <Avatar src="/static/images/avatar/1.jpg" />
                                  </ListItemDecorator>
                                  <ListItemContent>
                                    <Typography level="title-sm">{v.user.fname +' '+ v.user.lname}</Typography>
                                    <Typography level="body-sm" noWrap>
                                      {v.comment}
                                    </Typography>
                                  </ListItemContent>
                                </ListItem>
                                </List>
                        </>
                      )
                    })
                  }
                                  </div>

                </Card>
              </Grid> 
              <Grid xs={12} sm={12} md={4} lg={4}>
                <Card className="card"
                >
                                  <h3>آخرین دیدگاه ها</h3>
                <Divider />
                <div
                                              style={{minHeight:'500px', maxHeight:'500px', overflow:'auto'}}

                                              >
                <Box sx={{ direction:'ltr'}}>
                  <Typography
                    id="ellipsis-list-demo"
                    level="body-xs"
                    textTransform="uppercase"
                    sx={{ letterSpacing: '0.15rem' }}
                  >
                  </Typography>
                  <List
                    aria-labelledby="ellipsis-list-demo"
                    sx={{ '--ListItemDecorator-size': '56px' }}
                  >
                    <ListItem>
                      <ListItemDecorator>
                        <Avatar src="/static/images/avatar/1.jpg" />
                      </ListItemDecorator>
                      <ListItemContent>
                        <Typography component='div' level="title-sm">Any url ({social?.any}%)</Typography>
                        <Typography component='div' level="body-sm" noWrap>
                        <LinearProgress determinate value={social?.any} /> 

                        </Typography>
                      </ListItemContent>
                    </ListItem>

                    <ListItem>
                      <ListItemDecorator>
                        <Avatar src="/New-Google-Logo.jpg" />
                      </ListItemDecorator>
                      <ListItemContent>
                        <Typography component='div' level="title-sm">Google ({social?.google}%)</Typography>
                        <Typography component='div' level="body-sm" noWrap>
                        <LinearProgress determinate value={social?.google} /> 
                        </Typography>
                      </ListItemContent>
                    </ListItem>

                    <ListItem>
                      <ListItemDecorator>
                        <Avatar src="/modern-badge-logo-instagram-icon_578229-124.avif" />
                      </ListItemDecorator>
                      <ListItemContent>
                        <Typography component='div' level="title-sm">Instagram ({social?.instagram}%)</Typography>
                        <Typography component='div' level="body-sm" noWrap>
                        <LinearProgress determinate value={social?.instagram} /> 
                        </Typography>
                      </ListItemContent>
                    </ListItem>

                    <ListItem>
                      <ListItemDecorator>
                        <Avatar src="/facebook.png" />
                      </ListItemDecorator>
                      <ListItemContent>
                        <Typography component='div' level="title-sm">Facebook ({social?.facebook}%)</Typography>
                        <Typography component='div' level="body-sm" noWrap>
                        <LinearProgress determinate value={social?.facebook} /> 
                        </Typography>
                      </ListItemContent>
                    </ListItem>

                    <ListItem>
                      <ListItemDecorator>
                        <Avatar src="/twitter-logo-5.png" />
                      </ListItemDecorator>
                      <ListItemContent>
                        <Typography component='div' level="title-sm">Twitter ({social?.twitter}%)</Typography>
                        <Typography component='div' level="body-sm" noWrap>
                        <LinearProgress determinate value={social?.twitter} /> 
                        </Typography>
                      </ListItemContent>
                    </ListItem>

                    <ListItem>
                      <ListItemDecorator>
                        <Avatar src="/linkedin-logo.png" />
                      </ListItemDecorator>
                      <ListItemContent>
                        <Typography component='div' level="title-sm">Linkedin ({social?.linkedin}%)</Typography>
                        <Typography component='div' level="body-sm" noWrap>
                        <LinearProgress determinate value={social?.linkedin} /> 
                        </Typography>
                      </ListItemContent>
                    </ListItem>

                    <ListItem>
                      <ListItemDecorator>
                        <Avatar src="/youtube.png" />
                      </ListItemDecorator>
                      <ListItemContent>
                        <Typography component='div' level="title-sm">Youtube ({social?.youtube}%)</Typography>
                        <Typography component='div' level="body-sm" noWrap>
                        <LinearProgress determinate value={social?.youtube} /> 
                        </Typography>
                      </ListItemContent>
                    </ListItem>

                    <ListItem>
                      <ListItemDecorator>
                        <Avatar src="/static/images/avatar/2.jpg" />
                      </ListItemDecorator>
                      <ListItemContent>
                        <Typography component='div' level="title-sm">other ({social?.other}%)</Typography>
                        <Typography component='div' level="body-sm" noWrap>
                        <LinearProgress determinate value={social?.other} /> 
                        </Typography>
                      </ListItemContent>
                    </ListItem>
                  </List>
                </Box>
                </div>
                </Card>
              </Grid>

              <Grid xs={12}>
                {/* <Card className="card">
                  {
                    comment.map((v:any) => {
                      return (
                        <>
                              <List
                                aria-labelledby="ellipsis-list-demo"
                                sx={{ '--ListItemDecorator-size': '56px' }}
                              >
                                <ListItem>
                                  <ListItemDecorator>
                                    <Avatar src="/static/images/avatar/1.jpg" />
                                  </ListItemDecorator>
                                  <ListItemContent>
                                    <Typography level="title-sm">Brunch this weekend?</Typography>
                                    <Typography level="body-sm" noWrap>
                                      I&apos;ll be in your neighborhood doing errands this Tuesday.
                                    </Typography>
                                  </ListItemContent>
                                </ListItem>
                                </List>
                        </>
                      )
                    })
                  }
                </Card> */}
              </Grid> 
            </Grid>
            
          </Box>
      </Container>


    </main>
  )
}
