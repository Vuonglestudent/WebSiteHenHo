import { Feature, FeatureDetail } from './../models/models';
import { Component, OnInit } from '@angular/core';
import { FeatureService } from '../service/feature.service';

@Component({
  selector: 'app-feature-manager',
  templateUrl: './feature-manager.component.html',
  styleUrls: ['./feature-manager.component.css']
})
export class FeatureManagerComponent implements OnInit {

  constructor(
    private featureService: FeatureService
  ) { }

  ngOnInit(): void {
    if(this.featureService.features.length == 0){
      this.featureService.GetFeatures()
        .then(data =>{
          this.featureService.features = data;
          console.log(this.featureService.features)
        })
        .catch(error=>{
          console.log(error)
        })
    }
  }

  FeatureDetails: FeatureDetail[] = new Array();
  
  UpdateFeature: Feature = new Feature();
  UpdateFeatureDetail: FeatureDetail = new FeatureDetail();

  CreateFeature:Feature = new Feature();
  CreateFeatureDetail: FeatureDetail = new FeatureDetail();

  onDetails = (index) =>{
    this.FeatureDetails = this.featureService.features[index].featureDetails;
    console.log(this.FeatureDetails)
  }

  isRemoveFeature = true;
  removeFeatureId = -1;
  removeFeatureDetailId = -1;
  onDeleteFeature = (FeatureId) =>{
    this.isRemoveFeature = true;
    this.removeFeatureId = FeatureId;
  }

  onDeleteFeatureDetail = (featureDetailId) =>{
    this.isRemoveFeature = false;
    this.removeFeatureDetailId = featureDetailId;
  }

  onDelete = () =>{
    if(this.isRemoveFeature){
      console.log('remove feature with id = ' + this.removeFeatureId)
    }
    else{
      console.log('remove feature detail with id = ' + this.removeFeatureDetailId)
    }
  }

  onClickUpdateFeature = (updateFeature)=>{
    this.UpdateFeature = updateFeature;
    console.log(updateFeature);
  }

  onUpdateFeature(){
    console.log(this.UpdateFeature)
  }

  onClickCreateFeature = () =>{
    console.log(this.CreateFeature)
  }

  onAddFeatureDetail(){
    console.log(this.CreateFeatureDetail)
  }
}
