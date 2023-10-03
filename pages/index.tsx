import Header from '@/Components/header'
import Menu from '@/Components/menu'
import { Avatar, Box, Card, CardActions, CardContent, CircularProgress, Grid, LinearProgress, List, ListItem, ListItemContent, ListItemDecorator, SvgIcon, Typography } from '@mui/joy'
import { Line, Bar } from 'react-chartjs-2';
import Container from '@/Layouts/Continer';
import Chart from 'chart.js/auto';

import {CategoryScale} from 'chart.js'; 
import { useEffect } from 'react';
import { useRouter } from 'next/router';
Chart.register(CategoryScale);

export default function Home() {
  const router = useRouter()
  const data = {
    labels: ['10 روز قبل', '9 روز قبل', '8 روز قبل', '7 روز قبل', '6 روز قبل', '5 روز قبل', '4 روز قبل', '3 روز قبل', '2 روز قبل', 'دیروز'],
    datasets: [
      {
        label: 'بازدید کننده',
        data: [14, 19, 3, 5, 2, 3, 3, 5, 2, 3],
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
    document.body.classList.remove('loading')
  },[])
  return (
    <main className='main'>
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
                    <CircularProgress size="lg" determinate value={100}>
                      100+
                    </CircularProgress>
                    <CardContent>
                      <Typography level="body-md">بازدید امروز</Typography>
                      <Typography level="h2" sx={{textAlign:'left'}}> 160 نفر </Typography>
                    </CardContent>
                  </CardContent>
                  <CardActions>
                  </CardActions>
              </Card>  
              <Card className='mb-2' variant="solid" color="primary" invertedColors>
                  <CardContent orientation="horizontal">
                    <CircularProgress size="lg" determinate value={100}>
                      100+
                    </CircularProgress>
                    <CardContent>
                      <Typography level="body-md">بازدید امروز</Typography>
                      <Typography level="h2" sx={{textAlign:'left'}}> 160 نفر </Typography>
                    </CardContent>
                  </CardContent>
                  <CardActions>
                  </CardActions>
              </Card>  
              </Grid> 

              <Grid xs={12} sm={12} md={8} lg={8}>
                <Card className="card">
                  <Bar data={data} style={{width:'100%', height:'500px'}}/>
                </Card>
              </Grid> 
              <Grid xs={12} sm={12} md={4} lg={4}>
                <Card className="card">
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
                        <Typography level="title-sm">Any url (25%)</Typography>
                        <Typography level="body-sm" noWrap>
                        <LinearProgress determinate value={25} /> 

                        </Typography>
                      </ListItemContent>
                    </ListItem>

                    <ListItem>
                      <ListItemDecorator>
                        <Avatar src="/New-Google-Logo.jpg" />
                      </ListItemDecorator>
                      <ListItemContent>
                        <Typography level="title-sm">Google (25%)</Typography>
                        <Typography level="body-sm" noWrap>
                        <LinearProgress determinate value={25} /> 
                        </Typography>
                      </ListItemContent>
                    </ListItem>

                    <ListItem>
                      <ListItemDecorator>
                        <Avatar src="/modern-badge-logo-instagram-icon_578229-124.avif" />
                      </ListItemDecorator>
                      <ListItemContent>
                        <Typography level="title-sm">Instagram (25%)</Typography>
                        <Typography level="body-sm" noWrap>
                        <LinearProgress determinate value={25} /> 
                        </Typography>
                      </ListItemContent>
                    </ListItem>

                    <ListItem>
                      <ListItemDecorator>
                        <Avatar src="/facebook.png" />
                      </ListItemDecorator>
                      <ListItemContent>
                        <Typography level="title-sm">Facebook (25%)</Typography>
                        <Typography level="body-sm" noWrap>
                        <LinearProgress determinate value={25} /> 
                        </Typography>
                      </ListItemContent>
                    </ListItem>

                    <ListItem>
                      <ListItemDecorator>
                        <Avatar src="/twitter-logo-5.png" />
                      </ListItemDecorator>
                      <ListItemContent>
                        <Typography level="title-sm">Twitter (25%)</Typography>
                        <Typography level="body-sm" noWrap>
                        <LinearProgress determinate value={25} /> 
                        </Typography>
                      </ListItemContent>
                    </ListItem>

                    <ListItem>
                      <ListItemDecorator>
                        <Avatar src="/linkedin-logo.png" />
                      </ListItemDecorator>
                      <ListItemContent>
                        <Typography level="title-sm">Linkedin (42%)</Typography>
                        <Typography level="body-sm" noWrap>
                        <LinearProgress determinate value={42} /> 
                        </Typography>
                      </ListItemContent>
                    </ListItem>

                    <ListItem>
                      <ListItemDecorator>
                        <Avatar src="/youtube.png" />
                      </ListItemDecorator>
                      <ListItemContent>
                        <Typography level="title-sm">Youtube (12%)</Typography>
                        <Typography level="body-sm" noWrap>
                        <LinearProgress determinate value={12} /> 
                        </Typography>
                      </ListItemContent>
                    </ListItem>

                    <ListItem>
                      <ListItemDecorator>
                        <Avatar src="/static/images/avatar/2.jpg" />
                      </ListItemDecorator>
                      <ListItemContent>
                        <Typography level="title-sm">other (25%)</Typography>
                        <Typography level="body-sm" noWrap>
                        <LinearProgress determinate value={25} /> 
                        </Typography>
                      </ListItemContent>
                    </ListItem>
                  </List>
                </Box>
                </Card>
              </Grid>

              <Grid xs={12}>
                <Card className="card">
                  <Bar data={data} style={{width:'100%', height:'500px'}}/>
                </Card>
              </Grid> 
            </Grid>
            
          </Box>
      </Container>


    </main>
  )
}
